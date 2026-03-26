import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { MemberService } from './member/member.service';
import { MemberController } from './member/member.controller';

@Module({
  imports: [],
  controllers: [AppController, AccountController, MemberController],
  providers: [AppService, AccountService, MemberService],
})
export class AppModule {}
