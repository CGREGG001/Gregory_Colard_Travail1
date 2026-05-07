import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {

    private accounts: string[] = [
        '5273275',
        '8238942',
        '6236263',
        '2823823',
        '2523723'
    ];

    /**
     * getAccountStatus
     */
    public getAccountStatus():string {
        return 'Status: active';
    }

    /**
     * getAccountDetails
     */
    public getAccountDetails(): string {
        return 'Details: User account number 5273275';
    }

    /**
     * getAccountList
     */
    public getAccountList(): string[] {
        return this.accounts;
    }

    /**
     * updateAccount
     */
    public updateAccount(): string {
        return '';
    }

    /**
     * deleteAccount
     */
    public deleteAccount(account: string): boolean{

        return this.accounts.indexOf(account)? false : true;
    }
    
}
