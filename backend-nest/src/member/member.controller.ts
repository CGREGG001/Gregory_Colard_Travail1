import { Controller, Delete, Get, Put } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {

    constructor(private readonly memberService: MemberService) {}

    @Get('details')
    getInfo(): string {
        return this.memberService.getMemberInfo();
    }

    @Get('list')
    getList(): string[] {
        return this.memberService.getMemberList();
    }
    @Put('update')
    update() {
        return this.memberService.updateMember();
    }

    @Delete('delete')
    remove() {
        return this.memberService.removeMember();
    }
}
