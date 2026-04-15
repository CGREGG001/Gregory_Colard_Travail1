import { CredentialService } from './modules/security/services/credential.service';
import { AuthService } from './modules/security/services/auth.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './modules/account/account.controller';
import { AccountService } from './modules/account/account.service';
import { MemberService } from './modules/member/services/member.service';
import { MemberController } from './modules/member/member.controller';

@Module({
  imports: [],
  controllers: [AppController, AccountController, MemberController],
  providers: [
    CredentialService,
    AuthService, AppService, AccountService, MemberService],
})
export class AppModule { }
