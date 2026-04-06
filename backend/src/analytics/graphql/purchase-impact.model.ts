import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class DailyProjection {
  @Field()
  date: string;

  @Field(() => Float)
  balance: number;

  @Field()
  isPayday: boolean;

  @Field({ nullable: true })
  paydayName?: string;
}

@ObjectType()
export class PurchaseImpactResult {
  @Field(() => Float)
  currentBalance: number;

  @Field(() => Float)
  purchaseAmount: number;

  @Field(() => Float)
  balanceAfterPurchase: number;

  @Field(() => Float)
  alertThreshold: number;

  @Field()
  belowThreshold: boolean;

  @Field({ nullable: true })
  nextPayday?: Date;

  @Field({ nullable: true })
  recoveryDate?: Date;

  @Field(() => Int, { nullable: true })
  daysUntilRecovery?: number;

  @Field(() => [DailyProjection])
  projections: DailyProjection[];
}
