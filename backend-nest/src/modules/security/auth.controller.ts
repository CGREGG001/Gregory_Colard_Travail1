import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@security/services/auth.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { SignupDto, SigninDto, SigninResponseDto } from '@security/dtos';
import { MemberDto } from '@member/dtos';
import { RefreshTokenGuard } from '@security/guards';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Registers a new member in the system.
     * 
     * @param signupDto - Data required for registration (email, nickname, password, role).
     * @returns The newly created member profile as a DTO.
     */
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new member' })
    @ApiResponse({ status: 201, description: 'Member successfully created', type: MemberDto })
    @ApiBody({ type: SignupDto })
    async signup(@Body() signupDto: SignupDto): Promise<MemberDto> {
        const member = await this.authService.signup(signupDto);
        return new MemberDto(member);
    }

    /**
     * Authenticates a user and provides session tokens.
     * 
     * @param signinDto - Credentials (email/password).
     * @returns An object containing the member profile and the pair of JWT tokens (Access & Refresh).
     */
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate a member' })
    @ApiResponse({ status: 200, description: 'Authentication successful', type: SigninResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({ type: SigninDto })
    async signin(@Body() signinDto: SigninDto): Promise<SigninResponseDto> {
        const { member, accessToken, refreshToken } = await this.authService.signin(signinDto);
        return {
            user: new MemberDto(member),
            accessToken,
            refreshToken
        };
    }

    /**
     * Refreshes the user's session tokens.
     * Requires a valid Refresh Token in the Authorization header.
     * 
     * @param req - The request object containing the user payload from the RefreshTokenGuard.
     * @returns A new pair of Access and Refresh tokens.
     */
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Refresh session tokens', description: 'Rotates the current refresh token to provide a new set of credentials.' })
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(@Req() req: Request & { user: { sub: string; refreshToken: string } }) {
        const { sub, refreshToken } = req.user;
        return this.authService.refreshTokens(sub, refreshToken);
    }
}
