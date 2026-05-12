import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy
 * * This strategy handles the validation of the primary Access Token.
 * It is responsible for securing private routes by verifying the signature
 * and expiration of the JWT provided in the Authorization header.
 * * Once validated, the data returned by the `validate` method is attached
 * to the request object as `req.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Configures the strategy with JWT extraction rules and the access secret.
     * * @param configService - Service used to retrieve the 'JWT_ACCESS_TOKEN_SECRET'
     */
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        });
    }

    /**
     * Decodes and transforms the JWT payload into a user object.
     * * This method is called automatically after the JWT signature is verified.
     * * @param payload - The decoded content of the JWT (e.g., 'sub', 'email', 'role')
     * @returns The user data to be injected into the Request object (req.user)
     */
    async validate(payload: any) {
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
