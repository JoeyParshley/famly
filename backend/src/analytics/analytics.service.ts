import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { Payday } from './entities/payday.entity';
import { Household } from '../households/entities/household.entity';
import { PurchaseImpactDto, PurchaseImpactResult } from './dto/purchase-impact.dto';
import { CreatePaydayDto } from './dto/create-payday.dto';

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface BalanceTrend {
  date: string;
  balance: number;
  accountId: string;
  accountName: string;
}

export interface IncomeExpenseSummary {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Payday)
    private paydayRepository: Repository<Payday>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
  ) {}

  async getSpendingByCategory(
    householdId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<SpendingByCategory[]> {
    const now = new Date();
    const defaultStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEnd = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(ABS(transaction.amount))', 'amount')
      .addSelect('COUNT(*)', 'transactionCount')
      .leftJoin('transaction.account', 'account')
      .where('account.household_id = :householdId', { householdId })
      .andWhere('transaction.amount < 0')
      .andWhere('transaction.occurred_on >= :startDate', { startDate: defaultStart })
      .andWhere('transaction.occurred_on <= :endDate', { endDate: defaultEnd })
      .groupBy('transaction.category')
      .orderBy('amount', 'DESC')
      .getRawMany();

    const totalSpending = result.reduce(
      (sum, r) => sum + parseFloat(r.amount),
      0,
    );

    return result.map((r) => ({
      category: r.category,
      amount: Math.round(parseFloat(r.amount) * 100) / 100,
      percentage:
        totalSpending > 0
          ? Math.round((parseFloat(r.amount) / totalSpending) * 10000) / 100
          : 0,
      transactionCount: parseInt(r.transactionCount),
    }));
  }

  async getBalanceTrends(
    householdId: string,
    days: number = 30,
  ): Promise<BalanceTrend[]> {
    const accounts = await this.accountRepository.find({
      where: { household: { id: householdId } },
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends: BalanceTrend[] = [];

    for (const account of accounts) {
      // Get all transactions for this account in the period
      const transactions = await this.transactionRepository.find({
        where: {
          account: { id: account.id },
          occurredOn: Between(startDate, endDate),
        },
        order: { occurredOn: 'ASC' },
      });

      // Start with current balance and work backwards
      let balance = Number(account.balance);
      const dailyBalances: Map<string, number> = new Map();

      // Set today's balance
      dailyBalances.set(endDate.toISOString().split('T')[0], balance);

      // Calculate historical balances by reversing transactions
      for (let d = new Date(endDate); d >= startDate; d.setDate(d.getDate() - 1)) {
        const dateStr = d.toISOString().split('T')[0];

        // Find transactions on this date
        const dayTransactions = transactions.filter(
          (t) => new Date(t.occurredOn).toISOString().split('T')[0] === dateStr,
        );

        // Reverse the transactions to get the opening balance
        for (const t of dayTransactions) {
          balance -= Number(t.amount);
        }

        dailyBalances.set(dateStr, Math.round(balance * 100) / 100);
      }

      // Convert to array sorted by date
      const sortedDates = Array.from(dailyBalances.keys()).sort();
      for (const date of sortedDates) {
        trends.push({
          date,
          balance: dailyBalances.get(date)!,
          accountId: account.id,
          accountName: account.name,
        });
      }
    }

    return trends.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getIncomeExpenseTrends(
    householdId: string,
    months: number = 6,
  ): Promise<IncomeExpenseSummary[]> {
    const results: IncomeExpenseSummary[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthStr = monthStart.toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      const incomeResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.amount)', 'total')
        .leftJoin('transaction.account', 'account')
        .where('account.household_id = :householdId', { householdId })
        .andWhere('transaction.amount > 0')
        .andWhere('transaction.occurred_on >= :start', { start: monthStart })
        .andWhere('transaction.occurred_on <= :end', { end: monthEnd })
        .getRawOne();

      const expenseResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(ABS(transaction.amount))', 'total')
        .leftJoin('transaction.account', 'account')
        .where('account.household_id = :householdId', { householdId })
        .andWhere('transaction.amount < 0')
        .andWhere('transaction.occurred_on >= :start', { start: monthStart })
        .andWhere('transaction.occurred_on <= :end', { end: monthEnd })
        .getRawOne();

      const income = parseFloat(incomeResult?.total) || 0;
      const expenses = parseFloat(expenseResult?.total) || 0;

      results.push({
        month: monthStr,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        net: Math.round((income - expenses) * 100) / 100,
      });
    }

    return results;
  }

  async simulatePurchaseImpact(
    householdId: string,
    userId: string,
    dto: PurchaseImpactDto,
    alertThreshold: number = 500,
  ): Promise<PurchaseImpactResult> {
    // Get account
    const account = await this.accountRepository.findOne({
      where: { id: dto.accountId, household: { id: householdId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const currentBalance = Number(account.balance);
    const balanceAfterPurchase = currentBalance - dto.amount;
    const isBelowThreshold = balanceAfterPurchase < alertThreshold;

    // Get next payday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextPayday = await this.paydayRepository.findOne({
      where: {
        household: { id: householdId },
        nextDate: MoreThanOrEqual(today),
      },
      order: { nextDate: 'ASC' },
    });

    let daysUntilNextPayday = 0;
    let projectedBalanceAtPayday = balanceAfterPurchase;

    if (nextPayday) {
      const paydayDate = new Date(nextPayday.nextDate);
      daysUntilNextPayday = Math.ceil(
        (paydayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      projectedBalanceAtPayday = balanceAfterPurchase + Number(nextPayday.amount);
    }

    // Calculate daily projections for 30 days
    const dailyProjections: {
      date: string;
      balance: number;
      isPayday: boolean;
    }[] = [];

    let runningBalance = balanceAfterPurchase;
    const paydays = await this.paydayRepository.find({
      where: { household: { id: householdId } },
    });

    for (let i = 0; i < 30; i++) {
      const projDate = new Date(today);
      projDate.setDate(projDate.getDate() + i);
      const dateStr = projDate.toISOString().split('T')[0];

      // Check if any payday falls on this date
      let isPayday = false;
      for (const payday of paydays) {
        const paydayDate = new Date(payday.nextDate);
        if (paydayDate.toISOString().split('T')[0] === dateStr) {
          runningBalance += Number(payday.amount);
          isPayday = true;
        }
      }

      dailyProjections.push({
        date: dateStr,
        balance: Math.round(runningBalance * 100) / 100,
        isPayday,
      });
    }

    // Find recovery date (when balance goes back above threshold)
    let recoveryDate: string | null = null;
    if (isBelowThreshold) {
      const recoveryDay = dailyProjections.find(
        (p) => p.balance >= alertThreshold,
      );
      if (recoveryDay) {
        recoveryDate = recoveryDay.date;
      }
    }

    return {
      currentBalance: Math.round(currentBalance * 100) / 100,
      purchaseAmount: dto.amount,
      balanceAfterPurchase: Math.round(balanceAfterPurchase * 100) / 100,
      isBelowThreshold,
      alertThreshold,
      nextPayday: nextPayday
        ? {
            date: new Date(nextPayday.nextDate).toISOString().split('T')[0],
            amount: Number(nextPayday.amount),
            name: nextPayday.name,
          }
        : null,
      daysUntilNextPayday,
      projectedBalanceAtPayday: Math.round(projectedBalanceAtPayday * 100) / 100,
      recoveryDate,
      dailyProjections,
    };
  }

  // Payday management
  async createPayday(
    householdId: string,
    dto: CreatePaydayDto,
  ): Promise<Payday> {
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const payday = this.paydayRepository.create({
      ...dto,
      nextDate: new Date(dto.nextDate),
      household,
    });

    return this.paydayRepository.save(payday);
  }

  async getPaydays(householdId: string): Promise<Payday[]> {
    return this.paydayRepository.find({
      where: { household: { id: householdId } },
      order: { nextDate: 'ASC' },
    });
  }

  async deletePayday(householdId: string, paydayId: string): Promise<void> {
    const payday = await this.paydayRepository.findOne({
      where: { id: paydayId, household: { id: householdId } },
    });

    if (!payday) {
      throw new NotFoundException('Payday not found');
    }

    await this.paydayRepository.remove(payday);
  }

  async getDashboardSummary(householdId: string): Promise<{
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    topSpendingCategories: SpendingByCategory[];
  }> {
    const accounts = await this.accountRepository.find({
      where: { household: { id: householdId } },
    });

    const totalBalance = accounts.reduce(
      (sum, a) => sum + Number(a.balance),
      0,
    );

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const incomeResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'total')
      .leftJoin('transaction.account', 'account')
      .where('account.household_id = :householdId', { householdId })
      .andWhere('transaction.amount > 0')
      .andWhere('transaction.occurred_on >= :start', { start: monthStart })
      .andWhere('transaction.occurred_on <= :end', { end: monthEnd })
      .getRawOne();

    const expenseResult = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(ABS(transaction.amount))', 'total')
      .leftJoin('transaction.account', 'account')
      .where('account.household_id = :householdId', { householdId })
      .andWhere('transaction.amount < 0')
      .andWhere('transaction.occurred_on >= :start', { start: monthStart })
      .andWhere('transaction.occurred_on <= :end', { end: monthEnd })
      .getRawOne();

    const monthlyIncome = parseFloat(incomeResult?.total) || 0;
    const monthlyExpenses = parseFloat(expenseResult?.total) || 0;
    const savingsRate =
      monthlyIncome > 0
        ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
        : 0;

    const topSpendingCategories = await this.getSpendingByCategory(householdId);

    return {
      totalBalance: Math.round(totalBalance * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      savingsRate,
      topSpendingCategories: topSpendingCategories.slice(0, 5),
    };
  }
}
