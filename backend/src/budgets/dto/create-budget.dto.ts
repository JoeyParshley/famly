import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(BudgetPeriod)
  @IsOptional()
  period?: BudgetPeriod = BudgetPeriod.MONTHLY;
}
