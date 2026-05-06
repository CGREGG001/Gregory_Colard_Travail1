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
import { ApiCodeResponse } from '@core/api';
import { JWTDuration } from '@security/types';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

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
     * @param signupDto - The signup data transfer object containing the email and nickname of the new member.
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
     * @param dto - The signin data transfer object containing email and password.
     * @returns The authenticated Member entity.
     */
    async signin(dto: SigninDto): Promise<{ 
        member: Member;
        accessToken: string;
        refreshToken: string }> {
        
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

        const payload = { sub: member.id, email: member.email };

        const accessExp = this.configService.getOrThrow<JWTDuration>('JWT_ACCESS_TOKEN_EXPIRATION');
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: accessExp,
        });

        const refreshExp = this.configService.getOrThrow<JWTDuration>('JWT_REFRESH_TOKEN_EXPIRATION');
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: refreshExp,
        });

        // Hash refresh token
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

        // Store refresh token
        await this.tokenService.updateOrCreate(member, hashedRefreshToken);

        return {
            member,
            accessToken,
            refreshToken,
        };
    }
}
