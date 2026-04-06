import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { HouseholdRole } from '../../common/enums/role.enum';

export class AddMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(HouseholdRole)
  role: HouseholdRole;
}
