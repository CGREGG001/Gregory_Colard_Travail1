import { Controller, Delete, Get } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {

    constructor(private readonly accountService: AccountService) {}

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
