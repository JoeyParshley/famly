import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsUUID, IsOptional, Min, Max } from 'class-validator';
import { AccountType } from '../../graphql/enums';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  balance?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  institution?: string;
}

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @Field(() => AccountType, { nullable: true })
  @IsOptional()
  type?: AccountType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  balance?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  institution?: string;
}
