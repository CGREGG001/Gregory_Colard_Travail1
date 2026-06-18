import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { MemberService } from '@member/services';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { 
    MemberControllerDeleteDocumentation,
    MemberControllerDetailsDocumentation,
    MemberControllerListDocumentation,
    MemberControllerUpdateDocumentation 
} from '@member/member.swagger';
import { MemberResponseDto, UpdateMemberAdminDto } from './dtos';
import { MemberRole } from './enums';
import { Roles } from '@core/decorators';

@ApiTags('Admin - Members Management')
@ApiBearerAuth('access-token')
@Roles(MemberRole.ADMIN)
@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    @ApiOperation(MemberControllerListDocumentation)
    @ApiResponse({ status: 200, type: [MemberResponseDto] })
    async findAll(): Promise<MemberResponseDto[]> {
        const members = await this.memberService.findAll();
        return members.map(member => MemberResponseDto.fromEntity(member));
    }

    @Get(':id')
    @ApiOperation(MemberControllerDetailsDocumentation)
    @ApiResponse({ status: 200, type: MemberResponseDto })
    async findOne(@Param('id') id: string): Promise<MemberResponseDto> {
        const member = await this.memberService.findByIdOrFail(id);
        return MemberResponseDto.fromEntity(member);
    }

    @Put(':id')
    @ApiOperation(MemberControllerUpdateDocumentation)
    @ApiBody({ type: UpdateMemberAdminDto })
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, type: MemberResponseDto })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateMemberAdminDto
    ): Promise<MemberResponseDto> {
        const updatedMember = await this.memberService.update(id, dto);
        return MemberResponseDto.fromEntity(updatedMember);
    }

    @Delete(':id')
    @ApiOperation(MemberControllerDeleteDocumentation)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204 })
    async remove(@Param('id') id: string): Promise<void> {
        await this.memberService.softDelete(id);
    }
}
