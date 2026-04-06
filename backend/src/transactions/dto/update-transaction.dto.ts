import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  @IsOptional()
  accountId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsDateString()
  @IsOptional()
  occurredOn?: string;
}
