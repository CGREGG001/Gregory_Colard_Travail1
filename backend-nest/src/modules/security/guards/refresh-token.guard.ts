import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard used to protect the refresh endpoint. 
 * It triggers the 'jwt-refresh' Passport strategy to validate the Refresh Token's signature and expiration.
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
