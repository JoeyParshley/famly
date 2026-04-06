import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { BudgetPeriod } from '../../graphql/enums';

@ObjectType()
export class BudgetModel {
  @Field(() => ID)
  id: string;

  @Field()
  householdId: string;

  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field(() => BudgetPeriod)
  period: BudgetPeriod;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class BudgetWithSpending {
  @Field(() => ID)
  id: string;

  @Field()
  householdId: string;

  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field(() => BudgetPeriod)
  period: BudgetPeriod;

  @Field(() => Float)
  spent: number;

  @Field(() => Float)
  remaining: number;

  @Field(() => Float)
  percentUsed: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OverBudgetCategory {
  @Field()
  category: string;

  @Field(() => Float)
  budget: number;

  @Field(() => Float)
  spent: number;

  @Field(() => Float)
  overage: number;
}

@ObjectType()
export class BudgetSummary {
  @Field(() => Float)
  totalBudget: number;

  @Field(() => Float)
  totalSpent: number;

  @Field(() => Float)
  totalRemaining: number;

  @Field(() => [OverBudgetCategory])
  overBudgetCategories: OverBudgetCategory[];
}
