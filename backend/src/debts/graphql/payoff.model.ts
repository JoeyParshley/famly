import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { PayoffStrategy } from '../../graphql/enums';

@ObjectType()
export class MonthlyPayment {
  @Field(() => Int)
  month: number;

  @Field()
  debtName: string;

  @Field(() => Float)
  payment: number;

  @Field(() => Float)
  principal: number;

  @Field(() => Float)
  interest: number;

  @Field(() => Float)
  remainingBalance: number;
}

@ObjectType()
export class DebtPayoffResult {
  @Field()
  debtName: string;

  @Field(() => Float)
  originalBalance: number;

  @Field(() => Float)
  interestRate: number;

  @Field(() => Int)
  monthsToPayoff: number;

  @Field(() => Float)
  totalInterestPaid: number;

  @Field(() => Float)
  totalPaid: number;

  @Field()
  payoffDate: Date;

  @Field(() => [MonthlyPayment])
  monthlyPayments: MonthlyPayment[];
}

@ObjectType()
export class PayoffScenario {
  @Field(() => PayoffStrategy)
  strategy: PayoffStrategy;

  @Field(() => Float)
  extraMonthlyPayment: number;

  @Field(() => Int)
  totalMonths: number;

  @Field(() => Float)
  totalInterestPaid: number;

  @Field(() => Float)
  totalPaid: number;

  @Field()
  debtFreeDate: Date;

  @Field(() => [DebtPayoffResult])
  debts: DebtPayoffResult[];
}

@ObjectType()
export class StrategyComparison {
  @Field(() => PayoffScenario)
  avalanche: PayoffScenario;

  @Field(() => PayoffScenario)
  snowball: PayoffScenario;

  @Field(() => Float)
  interestSaved: number;

  @Field(() => Int)
  monthsDifference: number;

  @Field()
  recommendedStrategy: string;
}
