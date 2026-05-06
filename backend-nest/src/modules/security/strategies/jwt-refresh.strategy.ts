import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from 'express';

/**
 * JwtRefreshStrategy
 * 
 * This strategy validates the Refresh Token during the token rotation process.
 * It uses a dedicated secret (`JWT_REFRESH_TOKEN_SECRET`) to ensure that 
 * refresh tokens are handled separately from access tokens.
 * 
 * It enables `passReqToCallback` to extract the raw token from the headers,
 * which is necessary for comparing it against the hashed version stored in the database.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
        // Extracts the JWT from the "Authorization: Bearer <token>" header
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Uses a specific secret for refresh tokens for enhanced security
        secretOrKey: config.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        // Allows the request object to be passed to the validate method
        passReqToCallback: true,
    });
  }

  /**
   * Validates the decoded payload and retrieves the raw refresh token.
   * 
   * @param req - The incoming HTTP request
   * @param payload - The decoded JWT payload (contains 'sub', 'email', etc.)
   * @returns An object merging the payload and the raw refreshToken
   * @throws UnauthorizedException if the token is missing from the Authorization header
   */
    validate(req: Request, payload: any) {
    const refreshToken = req.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
        throw new UnauthorizedException();
    }

    // Returning the payload along with the raw token allows the AuthService
    // to verify the token against the hashed value in the database.
    return { ...payload, refreshToken };
    }
}
