import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@security/services/auth.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { SignupDto, SigninDto, SigninResponseDto } from '@security/dtos';
import { MemberDto } from '@member/dtos';
import { JwtAuthGuard, RefreshTokenGuard } from '@security/guards';
import { CurrentUser } from '@core/decorators';

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
    @ApiBearerAuth('refresh-token')
    @ApiOperation({ summary: 'Refresh session tokens', description: 'Rotates the current refresh token to provide a new set of credentials.' })
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refresh(@CurrentUser() user: { sub: string; refreshToken: string}) {
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }

    /**
     * Logs out the current user by invalidating their refresh token.
     * Requires a valid Access Token.
     * 
     * @param req - The request object containing the user payload.
     */
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout a member', description: 'Invalidates the current session by deleting the refresh token.' })
    @ApiResponse({ status: 204, description: 'Successfully logged out' })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@CurrentUser() user: { sub: string }): Promise<void> {
        await this.authService.logout(user.sub);
    }
}
