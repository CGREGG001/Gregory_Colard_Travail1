import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MemberService } from '@member/services';
import { MemberDto } from '@member/dtos';
import { CurrentUser } from '@core/decorators';

@ApiTags('Account')
@ApiBearerAuth('access-token')
@Controller('account')
export class AccountController {

    constructor(private readonly memberService: MemberService) {}

    /**
     * Retrieves the profile of the currently authenticated user.
     */
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user details', type: MemberDto })
    @Get('me')
    async getMe(@CurrentUser('sub') memberId: string): Promise<MemberDto> {
        // user.sub comes from JwtAuthGuard
        const member = await this.memberService.findByIdOrFail(memberId);
        
        return new MemberDto(member);
    }
}
