import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '@member/entities/member.entity';
import { 
    EmailAlreadyExistException,
    NicknameAlreadyExistException
} from '@core/config/exceptions/member.exceptions';
import { MemberRole } from '@member/enums';

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) {}

    /**
     * Creates a new member in the database.
     *
     * @param email - The email address of the member.
     * @param memberNickname - The nickname of the member.
     * @returns A Promise that resolves to the newly created member entity.
     */
    async create(email: string, nickname: string): Promise<Member> {
        const normalizedEmail = email.toLowerCase();

        // Check if member's email exists
        if (await this.memberRepository.findOne({ where: { email: normalizedEmail } })) {
            throw new EmailAlreadyExistException();
        }

        // Check if nickname's member exists
        if (await this.memberRepository.findOne({ where: { nickname } })) {
            throw new NicknameAlreadyExistException();
        }

        const member = this.memberRepository.create({
            email: normalizedEmail,
            nickname,
            role: MemberRole.USER // default value
        });

        // Save the new user to the database
        return this.memberRepository.save(member);
    }

    /**
    * Finds a member by their email address.
    * 
    * @param email - The email address to search for.
    * @returns A Promise that resolves to the Member entity if found, or null otherwise.
    */
    async findByEmail(email: string): Promise<Member | null> {
        return this.memberRepository.findOne({
            where: { email: email.toLowerCase() }
        });
    }

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
