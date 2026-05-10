import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@security/guards';
import { MemberService } from '@member/services';
import { MemberDto } from '@member/dtos';
import { CurrentUser } from '@core/decorators';

@ApiTags('Account')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('account')
export class AccountController {

    constructor(private readonly memberService: MemberService) {}

    /**
     * Retrieves the profile of the currently authenticated user.
     */
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user details', type: MemberDto })
    @Get('me')
    async getMe(@CurrentUser() user: { sub: string }): Promise<MemberDto> {
        // user.sub comes from JwtAuthGuard
        const member = await this.memberService.findByIdOrFail(user.sub);
        return new MemberDto(member);
    }
}
