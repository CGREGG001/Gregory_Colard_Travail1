import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Member } from '@member/entities';
import { MemberService } from '@member/services';
import { CredentialService, TokenService } from '@security/services';
import { SignupDto } from '@security/dtos/requests/signup.dto';
import { SigninDto } from '@security/dtos/requests/signin.dto';
import { ApiCodeResponse, ApiException } from '@core/api';
import { JWTDuration } from '@security/types';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

/**
 * Service handling authentication logic:
 * - Signup: creates a Member and its associated Credential.
 * - Signin: validates credentials, generates JWT tokens, and persists refresh tokens.
 * - Uses bcrypt for password hashing and JWT for token issuance.
 */
@Injectable()
export class AuthService {
    /**
     * Constructs an instance of AuthService.
     *
     * @param memberService - The member service for creating and managing members.
     * @param credentialService - The credential service for creating member credentials.
     */
    constructor(
        private readonly memberService: MemberService,
        private readonly credentialService: CredentialService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService
    ) {}

    /**
     * Signs up a new member by creating a member entity and their associated credentials.
     * Delegates validation to memberService and coordinates the transaction.
     * @param signupDto - The signup dto containing the email, nickname and hashed password of the new member.
     * @returns A promise that resolves to the newly created member entity.
     */
    @Transactional()
    async signup(signupDto: SignupDto): Promise<Member> {
        // Hash the password outside the transaction (save resources in DB)
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(signupDto.password, salt);

        // Creates a new member entity in the database
        const member = await this.memberService.create(
            signupDto.email,
            signupDto.nickname,
        );

        // Creates member credentials for the new member
        await this.credentialService.create(member, hashedPassword);

        return member;
    }

    /**
     * Authenticates a member by validating their credentials.
     * @param dto - The signin dto containing email and password.
     * @returns The authenticated Member entity.
     * @throws UnauthorizedException
     * Thrown when credentials are invalid or missing.
     */
    async signin(dto: SigninDto): Promise<{ member: Member; accessToken: string; refreshToken: string }> {
        
        const member = await this.memberService.findByEmail(dto.email);
        if (!member) {
            throw new UnauthorizedException(ApiCodeResponse.INVALID_CREDENTIALS);
        }

        // Security check before calling bcrypt
        const credential = await this.credentialService.findByMember(member);
        if (!credential || !credential.password) {
            throw new UnauthorizedException(ApiCodeResponse.INVALID_CREDENTIALS);
        }

        // bcrypt.compare(plaintext_password, hashed_password)
        const isValid = await bcrypt.compare(dto.password, credential.password);
        if (!isValid) {
            throw new UnauthorizedException(ApiCodeResponse.INVALID_CREDENTIALS);
        }

        const { accessToken, refreshToken } = await this.generateTokens(member);

        return {
            member,
            accessToken,
            refreshToken
        };
    }

    /**
     * Refreshes the authentication tokens by validating the current refresh token against the stored hash.
     * Implements "Refresh Token Rotation" for enhanced security.
     * 
     * @param memberId - The unique identifier of the member (extracted from JWT sub).
     * @param refreshToken - The plaintext refresh token provided by the client.
     * @returns A promise that resolves to a new pair of Access and Refresh tokens.
     * @throws {UnauthorizedException} If any step of the validation fails.
     */
    @Transactional()
    async refreshTokens(memberId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        // 1. Retrieve the member or fail
        const member = await this.memberService.findByIdOrFail(memberId);

        // 2. Retrieve credentials
        const credential = await this.credentialService.findByMember(member);
        if (!credential) {
            throw new UnauthorizedException(ApiCodeResponse.USER_NOT_FOUND);
        }

        // 3. Retrieve the persisted token record
        const tokenRecord = await this.tokenService.findByCredential(credential);
        if (!tokenRecord || !tokenRecord.hashedRefreshToken) {
            throw new UnauthorizedException(ApiCodeResponse.TOKEN_EXPIRED);
        }

        // 4. Security check: Compare the provided token with the hashed version in DB
        const isMatch = await bcrypt.compare(refreshToken, tokenRecord.hashedRefreshToken);
        if (!isMatch) {
            // Potential reuse attack or invalid token
            throw new UnauthorizedException(ApiCodeResponse.INVALID_CREDENTIALS);
        }

        // 5. Success: Generate a new pair and update the DB (Rotation)
        return this.generateTokens(member);
    }

    /**
     * Generates a new pair of Access and Refresh JWT tokens for a given member.
     * The refresh token is hashed and persisted in the database for future validation (Rotation).
     * 
     * @param member - The member entity for whom tokens are generated.
     * @returns A promise that resolves to an object containing the accessToken and refreshToken strings.
     * @throws {ApiException} If the associated credentials cannot be found (404).
     */
    private async generateTokens(member: Member): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { sub: member.id, email: member.email };
        
        // Get durations from config service
        const accessExp = this.configService.getOrThrow<JWTDuration>('JWT_ACCESS_TOKEN_EXPIRATION');
        const refreshExp = this.configService.getOrThrow<JWTDuration>('JWT_REFRESH_TOKEN_EXPIRATION');

        // Parallel generation for better performance
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: accessExp,
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: refreshExp,
            }),
        ]);

        // Hash refresh token for DB storage
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

        // Retrieve associated credentials
        const credential = await this.credentialService.findByMember(member);
        if (!credential) throw new ApiException(ApiCodeResponse.USER_NOT_FOUND, 404);
        
        // Persist or update the refresh token hash
        await this.tokenService.updateOrCreate(credential, hashedRefreshToken);

        return { accessToken, refreshToken };
    }
}
