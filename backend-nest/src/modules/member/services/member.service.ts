import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {

    private members: string[] = [
        'Jean Dupont',
        'Marie Martin',
        'Lucas Bernard',
        'Sophie Petit',
        'Thomas Durand'
    ]

    /**
     * getMember
     */
    public getMemberInfo(): string {
        return 'Member: Jean Dupont';
    }

    /**
     * getMembers
     */
    public getMemberList(): string[] {
        return this.members;
    }

    /**
     * updateMember
     */
    public updateMember(): string {
        return '';
    }

    /**
     * deleteMember
     */
    public removeMember(): boolean {
        return true;
    }
}
