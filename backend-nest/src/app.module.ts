import { AuthController } from './modules/security/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configManager } from '@core/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { MemberModule } from '@member/member.module';
import { SecurityModule } from '@security/security.module';
import { AccountModule } from '@account/account.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@security/guards';

@Module({
  imports: [
    TypeOrmModule.forRoot(configManager.getTypeOrmConfig()),
    ConfigModule.forRoot({ isGlobal: true }),
    MemberModule,
    AccountModule,
    SecurityModule
  ],
  controllers: [AuthController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule { }
