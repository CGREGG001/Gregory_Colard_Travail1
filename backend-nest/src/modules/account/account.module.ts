import { Module } from '@nestjs/common';
import { MemberModule } from '@member/member.module';
import { AccountController } from '@account/account.controller';

@Module({
    imports: [MemberModule],
    controllers: [AccountController],
    providers: []
})
export class AccountModule { }
