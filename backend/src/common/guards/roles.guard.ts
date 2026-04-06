import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseholdRole, hasMinimumRole } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { HouseholdMember } from '../../households/entities/household-member.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(HouseholdMember)
    private householdMemberRepository: Repository<HouseholdMember>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<HouseholdRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const householdId =
      request.params.householdId || request.params.hid || request.body.householdId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!householdId) {
      throw new ForbiddenException('Household ID is required');
    }

    const membership = await this.householdMemberRepository.findOne({
      where: {
        household: { id: householdId },
        user: { id: user.id },
      },
    });

    if (!membership) {
      throw new NotFoundException('You are not a member of this household');
    }

    const userRole = membership.role as HouseholdRole;
    const hasPermission = requiredRoles.some((requiredRole) =>
      hasMinimumRole(userRole, requiredRole),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `This action requires one of the following roles: ${requiredRoles.join(', ')}`,
      );
    }

    request.householdMembership = membership;
    return true;
  }
}
