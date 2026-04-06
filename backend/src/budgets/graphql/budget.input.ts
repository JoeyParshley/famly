import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID, IsOptional, Min } from 'class-validator';
import { BudgetPeriod } from '../../graphql/enums';

@InputType()
export class CreateBudgetInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @Field(() => Float)
  @Min(0)
  amount: number;

  @Field(() => BudgetPeriod, { nullable: true, defaultValue: BudgetPeriod.MONTHLY })
  @IsOptional()
  period?: BudgetPeriod;
}

@InputType()
export class UpdateBudgetInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  amount?: number;

  @Field(() => BudgetPeriod, { nullable: true })
  @IsOptional()
  period?: BudgetPeriod;
}
