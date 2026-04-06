import { IsEnum } from 'class-validator';
import { HouseholdRole } from '../../common/enums/role.enum';

export class UpdateMemberRoleDto {
  @IsEnum(HouseholdRole)
  role: HouseholdRole;
}
