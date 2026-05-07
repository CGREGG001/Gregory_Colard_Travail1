import { Module } from '@nestjs/common';
import { MemberModule } from '@member/member.module';
import { AccountController } from '@account/account.controller';
import { AccountService } from '@account/services/account.service';

@Module({
    imports: [MemberModule],
    controllers: [AccountController],
    providers: [AccountService]
})
export class AccountModule { }
