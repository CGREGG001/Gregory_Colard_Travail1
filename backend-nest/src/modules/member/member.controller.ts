import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MemberService } from '@member/services';
import { ApiOperation } from '@nestjs/swagger';
import { 
    MemberControllerCreateDocumentation,
    MemberControllerDeleteDocumentation,
    MemberControllerDetailsDocumentation,
    MemberControllerListDocumentation,
    MemberControllerUpdateDocumentation 
} from '@member/member.swagger';

@Controller('member')
export class MemberController {

    constructor(private readonly memberService: MemberService) {}

    @ApiOperation(MemberControllerCreateDocumentation)
    @Post()
    async create(@Body() payload: any) { // Payload à typer plus tard
        // TODO
    }
    
    @ApiOperation(MemberControllerListDocumentation)
    @Get()
    async getList() {
        // TODO
    }

    @ApiOperation(MemberControllerDetailsDocumentation)
    @Get(':id')
    async getInfo(@Param('id') id: string) {
        // TODO
    }

    @ApiOperation(MemberControllerUpdateDocumentation)
    @Put(':id')
    async update(@Param('id') id: string, @Body() payload: any) {
        // TODO
    }

    @ApiOperation(MemberControllerDeleteDocumentation)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        // TODO
    }
}
