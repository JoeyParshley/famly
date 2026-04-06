import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { BudgetPeriod } from './create-budget.dto';

export class UpdateBudgetDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsEnum(BudgetPeriod)
  @IsOptional()
  period?: BudgetPeriod;
}
