import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export class UpdatePreferencesDto {
  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;

  @IsNumber()
  @IsOptional()
  @Min(0)
  balanceAlertThreshold?: number;
}
