import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id: string;

  @Field()
  accountId: string;

  @Field(() => Float)
  amount: number;

  @Field()
  category: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  occurredOn: Date;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class TransactionCategory {
  @Field()
  category: string;

  @Field(() => Int)
  count: number;
}
