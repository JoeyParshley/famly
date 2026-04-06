import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { AccountType } from './create-account.dto';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsEnum(AccountType)
  @IsOptional()
  type?: AccountType;

  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsNumber()
  @IsOptional()
  interestRate?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  institution?: string;
}
