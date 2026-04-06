import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { DebtType } from './create-debt.dto';

export class UpdateDebtDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsEnum(DebtType)
  @IsOptional()
  type?: DebtType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minimumPayment?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(31)
  paymentDueDay?: number;
}
