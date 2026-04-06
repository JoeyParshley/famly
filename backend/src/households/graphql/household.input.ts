import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength, IsEmail, IsUUID } from 'class-validator';
import { HouseholdRole } from '../../graphql/enums';

@InputType()
export class CreateHouseholdInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

@InputType()
export class UpdateHouseholdInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

@InputType()
export class AddMemberInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => HouseholdRole)
  role: HouseholdRole;
}

@InputType()
export class UpdateMemberRoleInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsUUID()
  memberId: string;

  @Field(() => HouseholdRole)
  role: HouseholdRole;
}

@InputType()
export class RemoveMemberInput {
  @Field()
  @IsUUID()
  householdId: string;

  @Field()
  @IsUUID()
  memberId: string;
}
