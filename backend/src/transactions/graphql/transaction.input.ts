import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID, IsOptional, IsDateString } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  accountId: string;

  @Field(() => Float)
  amount: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @Field()
  @IsDateString()
  occurredOn: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  amount?: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  occurredOn?: string;
}

@InputType()
export class TransactionFilterInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @Field({ nullable: true })
  @IsOptional()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Int, { nullable: true, defaultValue: 50 })
  @IsOptional()
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  offset?: number;
}
