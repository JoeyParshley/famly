import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { Household } from '../households/entities/household.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentUsed: number;
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    householdId: string,
    createBudgetDto: CreateBudgetDto,
  ): Promise<Budget> {
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      household,
    });

    return this.budgetRepository.save(budget);
  }

  async findAll(householdId: string): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { household: { id: householdId } },
      order: { category: 'ASC' },
    });
  }

  async findOne(householdId: string, id: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, household: { id: householdId } },
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async update(
    householdId: string,
    id: string,
    updateBudgetDto: UpdateBudgetDto,
  ): Promise<Budget> {
    const budget = await this.findOne(householdId, id);
    Object.assign(budget, updateBudgetDto);
    return this.budgetRepository.save(budget);
  }

  async remove(householdId: string, id: string): Promise<void> {
    const budget = await this.findOne(householdId, id);
    await this.budgetRepository.remove(budget);
  }

  async getBudgetsWithSpending(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<BudgetWithSpending[]> {
    const budgets = await this.findAll(householdId);

    // Default to current month if no dates provided
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budgetsWithSpending: BudgetWithSpending[] = [];

    for (const budget of budgets) {
      const spendingResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(ABS(transaction.amount))', 'total')
        .leftJoin('transaction.account', 'account')
        .where('account.household_id = :householdId', { householdId })
        .andWhere('transaction.category = :category', { category: budget.category })
        .andWhere('transaction.amount < 0')
        .andWhere('transaction.occurred_on >= :startDate', {
          startDate: defaultStart,
        })
        .andWhere('transaction.occurred_on <= :endDate', { endDate: defaultEnd })
        .getRawOne();

      const spent = parseFloat(spendingResult?.total) || 0;
      const remaining = Number(budget.amount) - spent;
      const percentUsed =
        Number(budget.amount) > 0
          ? Math.round((spent / Number(budget.amount)) * 100)
          : 0;

      budgetsWithSpending.push({
        ...budget,
        spent,
        remaining,
        percentUsed,
      });
    }

    return budgetsWithSpending;
  }

  async getTotalBudget(householdId: string): Promise<number> {
    const result = await this.budgetRepository
      .createQueryBuilder('budget')
      .select('SUM(budget.amount)', 'total')
      .where('budget.household_id = :householdId', { householdId })
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }

  async getBudgetSummary(householdId: string): Promise<{
    totalBudget: number;
    totalSpent: number;
    totalRemaining: number;
    overBudgetCategories: string[];
  }> {
    const budgetsWithSpending = await this.getBudgetsWithSpending(householdId);

    const totalBudget = budgetsWithSpending.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );
    const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const overBudgetCategories = budgetsWithSpending
      .filter((b) => b.percentUsed > 100)
      .map((b) => b.category);

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      overBudgetCategories,
    };
  }
}
