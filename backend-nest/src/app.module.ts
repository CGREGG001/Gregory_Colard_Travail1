import { AuthController } from './modules/security/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configManager } from '@core/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberModule } from '@member/member.module';
import { SecurityModule } from '@security/security.module';
import { AccountModule } from '@account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configManager.getTypeOrmConfig()),
    MemberModule,
    AccountModule,
    SecurityModule
  ],
  controllers: [AuthController, AppController],
  providers: [AppService],
})
export class AppModule { }
