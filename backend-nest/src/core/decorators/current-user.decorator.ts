import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to retrieve the current authenticated user from the request.
 * Can also retrieve a specific property of the user object.
 * 
 * @example
 * @CurrentUser() user: any // gets the full user object
 * @CurrentUser('sub') memberId: string // gets only the 'sub' property
 */
export const CurrentUser = createParamDecorator(
  <T = any>(data: keyof T | undefined, ctx: ExecutionContext): T | T[keyof T] | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as T;

    if (!user) {
      return null;
    }

    return data ? user?.[data] : user;
  },
);
