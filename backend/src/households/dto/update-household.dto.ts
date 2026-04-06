import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateHouseholdDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;
}
