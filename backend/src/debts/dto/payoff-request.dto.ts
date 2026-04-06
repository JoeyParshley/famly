import { IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum PayoffStrategy {
  AVALANCHE = 'avalanche', // Highest interest first
  SNOWBALL = 'snowball', // Lowest balance first
}

export class PayoffRequestDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  extraMonthlyPayment?: number = 0;

  @IsEnum(PayoffStrategy)
  @IsOptional()
  strategy?: PayoffStrategy = PayoffStrategy.AVALANCHE;
}
