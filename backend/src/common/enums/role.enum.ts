export enum HouseholdRole {
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}

export const ROLE_HIERARCHY: Record<HouseholdRole, number> = {
  [HouseholdRole.VIEW]: 1,
  [HouseholdRole.EDIT]: 2,
  [HouseholdRole.ADMIN]: 3,
};

export function hasMinimumRole(
  userRole: HouseholdRole,
  requiredRole: HouseholdRole,
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
