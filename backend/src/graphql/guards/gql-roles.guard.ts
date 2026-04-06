import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { HouseholdsService } from '../../households/households.service';
import { HouseholdRole } from '../enums';
import { HouseholdRole as EntityHouseholdRole } from '../../common/enums/role.enum';

const ROLE_HIERARCHY = {
  [HouseholdRole.VIEW]: 1,
  [HouseholdRole.EDIT]: 2,
  [HouseholdRole.ADMIN]: 3,
};

export const ROLES_KEY = 'roles';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private householdsService: HouseholdsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<HouseholdRole>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    const user = ctx.getContext().req.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract householdId from various possible locations in args
    const householdId =
      args.householdId ||
      args.input?.householdId ||
      args.id; // For direct household queries

    if (!householdId) {
      // If no householdId in args, allow the request (household will be validated elsewhere)
      return true;
    }

    const membership = await this.householdsService.getMembershipRole(
      householdId,
      user.id,
    );

    if (!membership) {
      throw new ForbiddenException('Not a member of this household');
    }

    // Convert entity role to GraphQL enum if needed
    const memberRole = typeof membership === 'string'
      ? membership as HouseholdRole
      : (membership as EntityHouseholdRole) as unknown as HouseholdRole;

    const userRoleLevel = ROLE_HIERARCHY[memberRole] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      throw new ForbiddenException(
        `Requires ${requiredRole} role, you have ${memberRole}`,
      );
    }

    return true;
  }
}
