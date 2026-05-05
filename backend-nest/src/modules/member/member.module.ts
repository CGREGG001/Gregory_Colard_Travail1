import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@member/entities/member.entity';
import { MemberService } from '@member/services/member.service';
import { MemberController } from '@member/member.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Member])],
    controllers: [MemberController],
    providers: [MemberService],
    exports: [MemberService],
})
export class MemberModule { }
