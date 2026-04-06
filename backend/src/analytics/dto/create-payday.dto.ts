import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export enum PaydayFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
}

export class CreatePaydayDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(PaydayFrequency)
  frequency: PaydayFrequency;

  @IsDateString()
  @IsNotEmpty()
  nextDate: string;
}
