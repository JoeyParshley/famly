import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { AccountType } from '../../graphql/enums';

@ObjectType()
export class AccountModel {
  @Field(() => ID)
  id: string;

  @Field()
  householdId: string;

  @Field()
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field(() => Float)
  balance: number;

  @Field(() => Float, { nullable: true })
  interestRate?: number;

  @Field({ nullable: true })
  institution?: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class AccountsSummary {
  @Field(() => Float)
  totalBalance: number;

  @Field(() => Float)
  totalAssets: number;

  @Field(() => Float)
  totalLiabilities: number;

  @Field(() => Float)
  netWorth: number;
}
