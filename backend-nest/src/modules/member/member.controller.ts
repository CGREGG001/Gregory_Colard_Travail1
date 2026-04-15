import { Controller, Delete, Get, Put } from '@nestjs/common';
import { MemberService } from 'modules/member/services';
import { ApiOperation } from '@nestjs/swagger';
import { 
    MemberControllerDeleteDocumentation,
    MemberControllerDetailsDocumentation,
    MemberControllerListDocumentation,
    MemberControllerUpdateDocumentation 
} from 'modules/member/member.swagger';

@Controller('member')
export class MemberController {

    constructor(private readonly memberService: MemberService) {}

    @ApiOperation(MemberControllerDetailsDocumentation)
    @Get(':id')
    getInfo(): string {
        return this.memberService.getMemberInfo();
    }

    @ApiOperation(MemberControllerListDocumentation)
    @Get()
    getList(): string[] {
        return this.memberService.getMemberList();
    }

    @ApiOperation(MemberControllerUpdateDocumentation)
    @Put(':id')
    update() {
        return this.memberService.updateMember();
    }

    @ApiOperation(MemberControllerDeleteDocumentation)
    @Delete(':id')
    remove() {
        return this.memberService.removeMember();
    }
}
