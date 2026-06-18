import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MemberService } from '@member/services';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { 
    MemberControllerDeleteDocumentation,
    MemberControllerDetailsDocumentation,
    MemberControllerListDocumentation,
    MemberControllerUpdateDocumentation 
} from '@member/member.swagger';
import { MemberRole } from './enums/member-role.enum';
import { MemberDto, UpdateMemberAdminDto } from './dtos';

@ApiTags('Admin - Members Management')
@ApiBearerAuth('access-token')
@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Get()
    @ApiOperation(MemberControllerListDocumentation)
    @ApiResponse({ status: 200, type: [MemberDto] })
    async findAll(): Promise<MemberDto[]> {
        const members = await this.memberService.findAll();
        return members.map(member => MemberDto.fromEntity(member));
    }

    @Get(':id')
    @ApiOperation(MemberControllerDetailsDocumentation)
    @ApiResponse({ status: 200, type: MemberDto })
    async findOne(@Param('id') id: string): Promise<MemberDto> {
        const member = await this.memberService.findByIdOrFail(id);
        return MemberDto.fromEntity(member);
    }

    @Put(':id')
    @ApiOperation(MemberControllerUpdateDocumentation)
    @ApiBody({ type: UpdateMemberAdminDto })
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, type: MemberDto })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateMemberAdminDto
    ): Promise<MemberDto> {
        const updatedMember = await this.memberService.update(id, dto);
        return MemberDto.fromEntity(updatedMember);
    }

    @Delete(':id')
    @ApiOperation(MemberControllerDeleteDocumentation)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204 })
    async remove(@Param('id') id: string): Promise<void> {
        await this.memberService.softDelete(id);
    }
}
