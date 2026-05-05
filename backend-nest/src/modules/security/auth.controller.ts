import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '@security/services/auth.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

import { Member } from '@member/entities';
import { SignupDto, SigninDto } from '@security/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Endpoint to register a new member.
     */
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new member' })
    @ApiResponse({ status: 201, description: 'Member successfully created', type: Member })
    @ApiBody({ type: SignupDto })
    async signup(@Body() SignupDto: SignupDto): Promise<Member> {
        return this.authService.signup(SignupDto);
    }

    /**
     * Endpoint to authenticate a member.
     */
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate a member' })
    @ApiResponse({ status: 200, description: 'Authentication successful', type: Member })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({ type: SigninDto })
    async signin(@Body() signinDto: SigninDto): Promise<Member> {
        return this.authService.signin(signinDto);
    }
}
