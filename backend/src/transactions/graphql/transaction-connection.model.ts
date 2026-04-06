import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TransactionModel } from './transaction.model';

@ObjectType()
export class TransactionConnection {
  @Field(() => [TransactionModel])
  items: TransactionModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;

  @Field()
  hasMore: boolean;
}
