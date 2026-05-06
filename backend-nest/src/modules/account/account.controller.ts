import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountService } from '@account/services/account.service';
import { JwtAuthGuard } from '@security/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('account')
export class AccountController {

    constructor(private readonly accountService: AccountService) {}
    
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get('status')
    getStatus(): string {
        return this.accountService.getAccountStatus();
    }

    @Get('details')
    getDetails():string {
        return this.accountService.getAccountDetails();
    }

    @Get('list')
    getAccounts():string[] {
        return this.accountService.getAccountList();
    }
}
