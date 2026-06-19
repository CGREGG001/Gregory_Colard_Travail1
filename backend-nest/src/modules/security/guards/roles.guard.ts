import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MemberRole } from '@member/enums/member-role.enum';
import { ROLES_KEY } from '@core/decorators/roles.decorator';
import { ApiCodeResponse } from '@core/api';

/**
 * Guard that verifies if the authenticated user has the required roles
 * to access a specific resource.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
 * The Reflector is a NestJS utility used to read metadata
 * defined via decorators such as @Roles(), @Public(), etc.
 *
 * It allows guards and interceptors to know what rules or
 * configuration apply to the current route or controller.
 *
 * Example:
 * - @Roles(MemberRole.ADMIN) → metadata "roles" = ['admin']
 * - Reflector retrieves this metadata inside the guard.
 */
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles via @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles required, access garanted
    if (!requiredRoles) {
      return true;
    }

    // Retrieve the user injected by the JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // Security: missing user or missing role → forbidden
    if (!user || !user.role) {
      throw new ForbiddenException(ApiCodeResponse.FORBIDDEN_RESOURCE);
    }

    // Check if the user's role matches one of the required roles
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(ApiCodeResponse.FORBIDDEN_RESOURCE);
    }

    return true;
  }
}
