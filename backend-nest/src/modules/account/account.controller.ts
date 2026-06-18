import { Body, Controller, Get, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MemberService } from '@member/services';
import { MemberResponseDto, UpdateProfileDto } from '@member/dtos';
import { CurrentUser } from '@core/decorators';

@ApiTags('Account')
@ApiBearerAuth('access-token')
@Controller('account')
export class AccountController {

    constructor(private readonly memberService: MemberService) {}

    /**
     * Retrieves the profile of the currently authenticated user.
     * 
     * Requires a valid Access Token.
     *
     * @param user - Authenticated user extracted from JWT
     * @returns The MemberResponseDto representing the current user
     * @throws NotFoundException If the member does not exist
     */
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user details', type: MemberResponseDto })
    @HttpCode(HttpStatus.OK)
    async getMe(@CurrentUser() user: { sub: string } ): Promise<MemberResponseDto> {
        // user.sub comes from JwtAuthGuard
        const member = await this.memberService.findByIdOrFail(user.sub);
        
        // using static mapper from MemberDto
        return MemberResponseDto.fromEntity(member);
    }

    /**
     * Update the profile of the currently authenticated user.
     * 
     * Only editable fields defined in UpdateProfileDto can be modified.
     *
     * @param user - Authenticated user extracted from JWT
     * @param dto - Profile update payload
     * @returns The updated MemberResponseDto
     */
    @Put('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, type: MemberResponseDto })
    @ApiBody({ type: UpdateProfileDto })
    @HttpCode(HttpStatus.OK)
    async updateMe(
        @CurrentUser() user: { sub: string },
        @Body() dto: UpdateProfileDto
    ): Promise<MemberResponseDto> {
        const updatedMember = await this.memberService.update(user.sub, dto);

        // using static mapper from MemberDto
        return MemberResponseDto.fromEntity(updatedMember);
    }
}
