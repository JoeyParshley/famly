import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BudgetsService } from '../budgets.service';
import { BudgetModel, BudgetWithSpending, BudgetSummary } from './budget.model';
import { CreateBudgetInput, UpdateBudgetInput } from './budget.input';
import { GqlAuthGuard } from '../../graphql/guards/gql-auth.guard';

@Resolver(() => BudgetModel)
export class BudgetsResolver {
  constructor(private budgetsService: BudgetsService) {}

  @Query(() => [BudgetModel])
  @UseGuards(GqlAuthGuard)
  async budgets(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<BudgetModel[]> {
    const budgets = await this.budgetsService.findAll(householdId);
    return budgets.map((b) => ({
      id: b.id,
      householdId: householdId,
      category: b.category,
      amount: Number(b.amount),
      period: b.period as any,
      createdAt: b.createdAt,
    }));
  }

  @Query(() => BudgetModel)
  @UseGuards(GqlAuthGuard)
  async budget(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BudgetModel> {
    const b = await this.budgetsService.findOne(householdId, id);
    return {
      id: b.id,
      householdId: householdId,
      category: b.category,
      amount: Number(b.amount),
      period: b.period as any,
      createdAt: b.createdAt,
    };
  }

  @Query(() => [BudgetWithSpending])
  @UseGuards(GqlAuthGuard)
  async budgetsWithSpending(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('endDate', { nullable: true }) endDate?: string,
  ): Promise<BudgetWithSpending[]> {
    const budgets = await this.budgetsService.getBudgetsWithSpending(
      householdId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return budgets.map((b) => ({
      id: b.id,
      householdId: householdId,
      category: b.category,
      amount: Number(b.amount),
      period: b.period as any,
      spent: b.spent,
      remaining: b.remaining,
      percentUsed: b.percentUsed,
      createdAt: b.createdAt,
    }));
  }

  @Query(() => BudgetSummary)
  @UseGuards(GqlAuthGuard)
  async budgetSummary(
    @Args('householdId', { type: () => ID }) householdId: string,
  ): Promise<BudgetSummary> {
    const summary = await this.budgetsService.getBudgetSummary(householdId);
    const budgetsWithSpending =
      await this.budgetsService.getBudgetsWithSpending(householdId);

    const overBudgetCategories = budgetsWithSpending
      .filter((b) => b.percentUsed > 100)
      .map((b) => ({
        category: b.category,
        budget: Number(b.amount),
        spent: b.spent,
        overage: b.spent - Number(b.amount),
      }));

    return {
      totalBudget: summary.totalBudget,
      totalSpent: summary.totalSpent,
      totalRemaining: summary.totalRemaining,
      overBudgetCategories,
    };
  }

  @Mutation(() => BudgetModel)
  @UseGuards(GqlAuthGuard)
  async createBudget(
    @Args('input') input: CreateBudgetInput,
  ): Promise<BudgetModel> {
    const b = await this.budgetsService.create(input.householdId, {
      category: input.category,
      amount: input.amount,
      period: input.period as any,
    });
    return {
      id: b.id,
      householdId: input.householdId,
      category: b.category,
      amount: Number(b.amount),
      period: b.period as any,
      createdAt: b.createdAt,
    };
  }

  @Mutation(() => BudgetModel)
  @UseGuards(GqlAuthGuard)
  async updateBudget(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBudgetInput,
  ): Promise<BudgetModel> {
    const b = await this.budgetsService.update(householdId, id, input as any);
    return {
      id: b.id,
      householdId: householdId,
      category: b.category,
      amount: Number(b.amount),
      period: b.period as any,
      createdAt: b.createdAt,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteBudget(
    @Args('householdId', { type: () => ID }) householdId: string,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.budgetsService.remove(householdId, id);
    return true;
  }
}
