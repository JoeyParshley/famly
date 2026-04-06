import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';
import { Theme } from '../../graphql/enums';

@InputType()
export class UpdatePreferencesInput {
  @Field(() => Theme, { nullable: true })
  @IsOptional()
  theme?: Theme;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  balanceAlertThreshold?: number;
}
