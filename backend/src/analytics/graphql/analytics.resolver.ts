import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../analytics.service';
import { PreferencesService } from '../../preferences/preferences.service';
import {
  SpendingByCategory,
  BalanceTrend,
  IncomeExpenseTrend,
  DashboardSummary,
} from './analytics.model';
import { PaydayModel } from './payday.model';
import { PurchaseImpactResult } from './purchase-impact.model';
import {
  CreatePaydayInput,
  PurchaseImpactInput,
  SpendingByCategoryInput,
  BalanceTrendsInput,
  IncomeExpenseTrendsInput,
} from './analytics.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';

@Resolver()
export class AnalyticsResolver {
  constructor(
    private analyticsService: AnalyticsService,
    private preferencesService: PreferencesService,
  ) {}

  @Query(() => [SpendingByCategory])
  @UseGuards(GqlAuthGuard)
  async spendingByCategory(
    @Args('input') input: SpendingByCategoryInput,
  ): Promise<SpendingByCategory[]> {
    const spending = await this.analyticsService.getSpendingByCategory(
      input.householdId,
      input.startDate ? new Date(input.startDate) : undefined,
      input.endDate ? new Date(input.endDate) : undefined,
    );
    return spending;
  }

  @Query(() => [BalanceTrend])
  @UseGuards(GqlAuthGuard)
  async balanceTrends(
    @Args('input') input: BalanceTrendsInput,
  ): Promise<BalanceTrend[]> {
    const trends = await this.analyticsService.getBalanceTrends(
      input.householdId,
      input.days || 30,
    );
    return trends.map((t) => ({
      date: t.date,
      balance: t.balance,
    }));
  }

  @Query(() => [IncomeExpenseTrend])
  @UseGuards(GqlAuthGuard)
  async incomeExpenseTrends(
    @Args('input') input: IncomeExpenseTrendsInput,
  ): Promise<IncomeExpenseTrend[]> {
    const trends = await this.analyticsService.getIncomeExpenseTrends(
      input.householdId,
      input.months || 6,
    );
    return trends;
  }

  @Query(() => PurchaseImpactResult)
  @UseGuards(GqlAuthGuard)
  async purchaseImpact(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('input') input: PurchaseImpactInput,
    @CurrentUser() user: { id: string },
  ): Promise<PurchaseImpactResult> {
    const alertThreshold = await this.preferencesService.getAlertThreshold(
      user.id,
    );
    const result = await this.analyticsService.simulatePurchaseImpact(
      householdId,
      user.id,
      {
        accountId: input.accountId,
        amount: input.amount,
      },
      alertThreshold,
    );

    return {
      currentBalance: result.currentBalance,
      purchaseAmount: result.purchaseAmount,
      balanceAfterPurchase: result.balanceAfterPurchase,
      alertThreshold: result.alertThreshold,
      belowThreshold: result.isBelowThreshold,
      nextPayday: result.nextPayday ? new Date(result.nextPayday.date) : undefined,
      recoveryDate: result.recoveryDate ? new Date(result.recoveryDate) : undefined,
      daysUntilRecovery: result.recoveryDate
        ? Math.ceil(
            (new Date(result.recoveryDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          )
        : undefined,
      projections: result.dailyProjections.map((p) => ({
        date: p.date,
        balance: p.balance,
        isPayday: p.isPayday,
        paydayName: undefined,
      })),
    };
  }

  @Query(() => DashboardSummary)
  @UseGuards(GqlAuthGuard)
  async dashboardSummary(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<DashboardSummary> {
    const summary = await this.analyticsService.getDashboardSummary(householdId);
    return {
      totalBalance: summary.totalBalance,
      monthlyIncome: summary.monthlyIncome,
      monthlyExpenses: summary.monthlyExpenses,
      savingsRate: summary.savingsRate,
      topCategories: summary.topSpendingCategories.map((c) => ({
        category: c.category,
        amount: c.amount,
      })),
    };
  }

  @Query(() => [PaydayModel])
  @UseGuards(GqlAuthGuard)
  async paydays(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<PaydayModel[]> {
    const paydays = await this.analyticsService.getPaydays(householdId);
    return paydays.map((p) => ({
      id: p.id,
      householdId: householdId,
      name: p.name,
      amount: Number(p.amount),
      frequency: p.frequency as any,
      nextDate: p.nextDate,
      createdAt: p.createdAt,
    }));
  }

  @Mutation(() => PaydayModel)
  @UseGuards(GqlAuthGuard)
  async createPayday(
    @Args('input') input: CreatePaydayInput,
  ): Promise<PaydayModel> {
    const p = await this.analyticsService.createPayday(input.householdId, {
      name: input.name,
      amount: input.amount,
      frequency: input.frequency as any,
      nextDate: input.nextDate,
    });
    return {
      id: p.id,
      householdId: input.householdId,
      name: p.name,
      amount: Number(p.amount),
      frequency: p.frequency as any,
      nextDate: p.nextDate,
      createdAt: p.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deletePayday(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.analyticsService.deletePayday(householdId, id);
    return true;
  }
}
