import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SpendingByCategory {
  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  percentage: number;

  @Field(() => Int)
  transactionCount: number;
}

@ObjectType()
export class BalanceTrend {
  @Field()
  date: string;

  @Field(() => Float)
  balance: number;
}

@ObjectType()
export class IncomeExpenseTrend {
  @Field()
  month: string;

  @Field(() => Float)
  income: number;

  @Field(() => Float)
  expenses: number;

  @Field(() => Float)
  net: number;
}

@ObjectType()
export class TopCategory {
  @Field()
  category: string;

  @Field(() => Float)
  amount: number;
}

@ObjectType()
export class DashboardSummary {
  @Field(() => Float)
  totalBalance: number;

  @Field(() => Float)
  monthlyIncome: number;

  @Field(() => Float)
  monthlyExpenses: number;

  @Field(() => Float)
  savingsRate: number;

  @Field(() => [TopCategory])
  topCategories: TopCategory[];
}
