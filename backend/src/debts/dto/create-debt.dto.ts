import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export enum DebtType {
  MORTGAGE = 'mortgage',
  AUTO_LOAN = 'auto_loan',
  STUDENT_LOAN = 'student_loan',
  CREDIT_CARD = 'credit_card',
  PERSONAL_LOAN = 'personal_loan',
  MEDICAL = 'medical',
  OTHER = 'other',
}

export class CreateDebtDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(DebtType)
  type: DebtType;

  @IsNumber()
  @Min(0)
  amount: number;

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
