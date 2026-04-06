import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID, IsOptional, Min, Max } from 'class-validator';
import { DebtType, PayoffStrategy } from '../../graphql/enums';

@InputType()
export class CreateDebtInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field(() => DebtType)
  type: DebtType;

  @Field(() => Float)
  @Min(0)
  amount: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  minimumPayment?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;
}

@InputType()
export class UpdateDebtInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @Field(() => DebtType, { nullable: true })
  @IsOptional()
  type?: DebtType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  amount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  minimumPayment?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;
}

@InputType()
export class PayoffInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  extraMonthlyPayment?: number;

  @Field(() => PayoffStrategy, { nullable: true, defaultValue: PayoffStrategy.AVALANCHE })
  @IsOptional()
  strategy?: PayoffStrategy;
}
