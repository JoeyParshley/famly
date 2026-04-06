import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DebtsService } from '../debts.service';
import { DebtModel, DebtSummary } from './debt.model';
import { PayoffScenario, StrategyComparison } from './payoff.model';
import { CreateDebtInput, UpdateDebtInput, PayoffInput } from './debt.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { PayoffStrategy } from '../../graphql/enums';

@Resolver(() => DebtModel)
export class DebtsResolver {
  constructor(private debtsService: DebtsService) {}

  @Query(() => [DebtModel])
  @UseGuards(GqlAuthGuard)
  async debts(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<DebtModel[]> {
    const debts = await this.debtsService.findAll(householdId);
    return debts.map((d) => ({
      id: d.id,
      householdId: householdId,
      name: d.name,
      type: d.type as any,
      amount: Number(d.amount),
      interestRate: d.interestRate != null ? Number(d.interestRate) : undefined,
      minimumPayment: d.minimumPayment != null ? Number(d.minimumPayment) : undefined,
      paymentDueDay: d.paymentDueDay,
      createdAt: d.createdAt,
    }));
  }

  @Query(() => DebtModel)
  @UseGuards(GqlAuthGuard)
  async debt(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<DebtModel> {
    const d = await this.debtsService.findOne(householdId, id);
    return {
      id: d.id,
      householdId: householdId,
      name: d.name,
      type: d.type as any,
      amount: Number(d.amount),
      interestRate: d.interestRate != null ? Number(d.interestRate) : undefined,
      minimumPayment: d.minimumPayment != null ? Number(d.minimumPayment) : undefined,
      paymentDueDay: d.paymentDueDay,
      createdAt: d.createdAt,
    };
  }

  @Query(() => DebtSummary)
  @UseGuards(GqlAuthGuard)
  async debtSummary(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<DebtSummary> {
    const summary = await this.debtsService.getDebtSummary(householdId);
    return {
      totalDebt: summary.totalDebt,
      totalMinimumPayment: summary.totalMinimumPayment,
      highestInterestRate: summary.highestInterestRate || undefined,
      lowestBalance: summary.lowestBalance || undefined,
      debtCount: summary.debtCount,
    };
  }

  @Query(() => PayoffScenario)
  @UseGuards(GqlAuthGuard)
  async debtPayoffScenario(
    @Args('input') input: PayoffInput,
  ): Promise<PayoffScenario> {
    const scenario = await this.debtsService.getPayoffScenario(
      input.householdId,
      {
        extraMonthlyPayment: input.extraMonthlyPayment || 0,
        strategy: (input.strategy || PayoffStrategy.AVALANCHE) as any,
      },
    );

    return {
      strategy: scenario.strategy as any,
      extraMonthlyPayment: scenario.extraMonthlyPayment,
      totalMonths: scenario.totalMonths,
      totalInterestPaid: scenario.totalInterest,
      totalPaid: scenario.totalPaid,
      debtFreeDate: new Date(scenario.debtFreeDate),
      debts: scenario.debtResults.map((d) => ({
        debtName: d.debtName,
        originalBalance: d.originalBalance,
        interestRate: 0, // Not available in debtResults
        monthsToPayoff: d.monthsToPayoff,
        totalInterestPaid: d.totalInterest,
        totalPaid: d.totalPaid,
        payoffDate: new Date(d.payoffDate),
        monthlyPayments: scenario.monthlySchedule
          .filter((p) => p.debtId === d.debtId)
          .map((p) => ({
            month: p.month,
            debtName: p.debtName,
            payment: p.payment,
            principal: p.principal,
            interest: p.interest,
            remainingBalance: p.remainingBalance,
          })),
      })),
    };
  }

  @Query(() => StrategyComparison)
  @UseGuards(GqlAuthGuard)
  async compareStrategies(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('extraMonthlyPayment', { type: () => Float, nullable: true, defaultValue: 0 })
    extraMonthlyPayment: number,
  ): Promise<StrategyComparison> {
    const comparison = await this.debtsService.compareStrategies(
      householdId,
      extraMonthlyPayment,
    );

    const mapScenario = (s: any): PayoffScenario => ({
      strategy: s.strategy as any,
      extraMonthlyPayment: s.extraMonthlyPayment,
      totalMonths: s.totalMonths,
      totalInterestPaid: s.totalInterest,
      totalPaid: s.totalPaid,
      debtFreeDate: new Date(s.debtFreeDate),
      debts: s.debtResults.map((d: any) => ({
        debtName: d.debtName,
        originalBalance: d.originalBalance,
        interestRate: 0,
        monthsToPayoff: d.monthsToPayoff,
        totalInterestPaid: d.totalInterest,
        totalPaid: d.totalPaid,
        payoffDate: new Date(d.payoffDate),
        monthlyPayments: s.monthlySchedule
          .filter((p: any) => p.debtId === d.debtId)
          .map((p: any) => ({
            month: p.month,
            debtName: p.debtName,
            payment: p.payment,
            principal: p.principal,
            interest: p.interest,
            remainingBalance: p.remainingBalance,
          })),
      })),
    });

    return {
      avalanche: mapScenario(comparison.avalanche),
      snowball: mapScenario(comparison.snowball),
      interestSaved: comparison.savings.interestSaved,
      monthsDifference: comparison.savings.monthsSaved,
      recommendedStrategy: comparison.savings.recommendedStrategy,
    };
  }

  @Mutation(() => DebtModel)
  @UseGuards(GqlAuthGuard)
  async createDebt(@Args('input') input: CreateDebtInput): Promise<DebtModel> {
    const d = await this.debtsService.create(input.householdId, {
      name: input.name,
      type: input.type as any,
      amount: input.amount,
      interestRate: input.interestRate,
      minimumPayment: input.minimumPayment,
      paymentDueDay: input.paymentDueDay,
    });
    return {
      id: d.id,
      householdId: input.householdId,
      name: d.name,
      type: d.type as any,
      amount: Number(d.amount),
      interestRate: d.interestRate != null ? Number(d.interestRate) : undefined,
      minimumPayment: d.minimumPayment != null ? Number(d.minimumPayment) : undefined,
      paymentDueDay: d.paymentDueDay,
      createdAt: d.createdAt,
    };
  }

  @Mutation(() => DebtModel)
  @UseGuards(GqlAuthGuard)
  async updateDebt(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateDebtInput,
  ): Promise<DebtModel> {
    const d = await this.debtsService.update(householdId, id, input as any);
    return {
      id: d.id,
      householdId: householdId,
      name: d.name,
      type: d.type as any,
      amount: Number(d.amount),
      interestRate: d.interestRate != null ? Number(d.interestRate) : undefined,
      minimumPayment: d.minimumPayment != null ? Number(d.minimumPayment) : undefined,
      paymentDueDay: d.paymentDueDay,
      createdAt: d.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteDebt(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.debtsService.remove(householdId, id);
    return true;
  }
}
