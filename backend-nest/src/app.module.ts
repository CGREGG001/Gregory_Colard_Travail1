import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';

@Module({
  imports: [],
  controllers: [AppController, AccountController],
  providers: [AppService, AccountService],
})
export class AppModule {}
