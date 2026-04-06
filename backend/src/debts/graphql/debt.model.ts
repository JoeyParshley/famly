import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { DebtType } from '../../graphql/enums';

@ObjectType()
export class DebtModel {
  @Field(() => ID)
  id: string;

  @Field()
  householdId: string;

  @Field()
  name: string;

  @Field(() => DebtType)
  type: DebtType;

  @Field(() => Float)
  amount: number;

  @Field(() => Float, { nullable: true })
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  minimumPayment?: number;

  @Field(() => Int, { nullable: true })
  paymentDueDay?: number;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class DebtSummary {
  @Field(() => Float)
  totalDebt: number;

  @Field(() => Float)
  totalMinimumPayment: number;

  @Field(() => Float, { nullable: true })
  highestInterestRate?: number;

  @Field(() => Float, { nullable: true })
  lowestBalance?: number;

  @Field(() => Int)
  debtCount: number;
}
