import { SetMetadata } from '@nestjs/common';
import { HouseholdRole } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: HouseholdRole[]) =>
  SetMetadata(ROLES_KEY, roles);
