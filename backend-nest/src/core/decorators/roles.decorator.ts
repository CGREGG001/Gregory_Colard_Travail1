import { SetMetadata } from '@nestjs/common';
import { MemberRole } from '@member/enums/member-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator used to restrict route access to specific member roles.
 * 
 * @param roles - List of allowed MemberRole values.
 */
export const Roles = (...roles: MemberRole[]) => SetMetadata(ROLES_KEY, roles);
