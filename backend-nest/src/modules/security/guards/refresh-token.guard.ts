import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard used to protect the refresh endpoint. 
 * It triggers the 'jwt-refresh' Passport strategy to validate the Refresh Token's signature and expiration.
 * It also manually extracts the raw token from the headers to append it to the user payload.
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {

    /**
     * Activates the guard, performs standard Passport validation, and enriches 
     * the user object with the raw refresh token for subsequent rotation logic.
     * 
     * @param context - The execution context of the current request.
     * @returns The result of the standard authentication process.
     */
    canActivate(context: ExecutionContext) {
        const can = super.canActivate(context);

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (token) {
        request.user = {
            ...request.user,
            refreshToken: token,
        };
    }

    return can;
  }
}
