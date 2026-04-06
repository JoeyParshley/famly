import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './entities/debt.entity';
import { Household } from '../households/entities/household.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PayoffRequestDto, PayoffStrategy } from './dto/payoff-request.dto';
import {
  DebtCalculatorService,
  PayoffScenario,
} from './services/debt-calculator.service';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private debtRepository: Repository<Debt>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
    private debtCalculator: DebtCalculatorService,
  ) {}

  async create(
    householdId: string,
    createDebtDto: CreateDebtDto,
  ): Promise<Debt> {
    const household = await this.householdRepository.findOne({
      where: { id: householdId },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    const debt = this.debtRepository.create({
      ...createDebtDto,
      household,
    });

    return this.debtRepository.save(debt);
  }

  async findAll(householdId: string): Promise<Debt[]> {
    return this.debtRepository.find({
      where: { household: { id: householdId } },
      order: { amount: 'DESC' },
    });
  }

  async findOne(householdId: string, id: string): Promise<Debt> {
    const debt = await this.debtRepository.findOne({
      where: { id, household: { id: householdId } },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    return debt;
  }

  async update(
    householdId: string,
    id: string,
    updateDebtDto: UpdateDebtDto,
  ): Promise<Debt> {
    const debt = await this.findOne(householdId, id);
    Object.assign(debt, updateDebtDto);
    return this.debtRepository.save(debt);
  }

  async remove(householdId: string, id: string): Promise<void> {
    const debt = await this.findOne(householdId, id);
    await this.debtRepository.remove(debt);
  }

  async getPayoffScenario(
    householdId: string,
    request: PayoffRequestDto,
  ): Promise<PayoffScenario> {
    const debts = await this.findAll(householdId);
    return this.debtCalculator.calculatePayoffScenario(
      debts,
      request.extraMonthlyPayment,
      request.strategy,
    );
  }

  async getSingleDebtPayoff(
    householdId: string,
    debtId: string,
    request: PayoffRequestDto,
  ): Promise<PayoffScenario> {
    const debt = await this.findOne(householdId, debtId);
    return this.debtCalculator.calculatePayoffScenario(
      [debt],
      request.extraMonthlyPayment,
      request.strategy,
    );
  }

  async compareStrategies(
    householdId: string,
    extraMonthlyPayment: number = 0,
  ) {
    const debts = await this.findAll(householdId);
    return this.debtCalculator.compareStrategies(debts, extraMonthlyPayment);
  }

  async getDebtSummary(householdId: string): Promise<{
    totalDebt: number;
    totalMinimumPayment: number;
    debtCount: number;
    highestInterestRate: number;
    lowestBalance: number;
  }> {
    const debts = await this.findAll(householdId);

    if (debts.length === 0) {
      return {
        totalDebt: 0,
        totalMinimumPayment: 0,
        debtCount: 0,
        highestInterestRate: 0,
        lowestBalance: 0,
      };
    }

    return {
      totalDebt: this.debtCalculator.getTotalDebt(debts),
      totalMinimumPayment: this.debtCalculator.calculateMinimumPaymentTotal(debts),
      debtCount: debts.length,
      highestInterestRate: Math.max(...debts.map((d) => Number(d.interestRate))),
      lowestBalance: Math.min(...debts.map((d) => Number(d.amount))),
    };
  }
}
