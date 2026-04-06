import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID, IsOptional, Min, IsDateString } from 'class-validator';
import { PaydayFrequency } from '../../graphql/enums';

@InputType()
export class CreatePaydayInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field(() => Float)
  @Min(0)
  amount: number;

  @Field(() => PaydayFrequency)
  frequency: PaydayFrequency;

  @Field()
  @IsDateString()
  nextDate: string;
}

@InputType()
export class PurchaseImpactInput {
  @Field()
  @IsUUID()
  accountId: string;

  @Field(() => Float)
  @Min(0)
  amount: number;
}

@InputType()
export class SpendingByCategoryInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

@InputType()
export class BalanceTrendsInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field(() => Int, { nullable: true, defaultValue: 30 })
  @IsOptional()
  @Min(1)
  days?: number;
}

@InputType()
export class IncomeExpenseTrendsInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field(() => Int, { nullable: true, defaultValue: 6 })
  @IsOptional()
  @Min(1)
  months?: number;
}
