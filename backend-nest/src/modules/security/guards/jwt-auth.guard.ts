import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@core/decorators';

/**
 * Global authentication guard using the 'jwt' Passport strategy.
 * It protects all routes by default ("Secure by Default"). 
 * Routes or controllers decorated with `@Public()` are bypassed.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflectetor: Reflector){
        super();
    }

    /**
     * Determines whether the current request is allowed to proceed.
     * 
     * @param context - The execution context of the current request.
     * @returns `true` if the route is public, otherwise delegates to standard JWT validation.
     */
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflectetor.getAllAndOverride<boolean>( IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
