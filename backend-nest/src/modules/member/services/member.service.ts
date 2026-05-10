import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '@member/entities/member.entity';
import { 
    EmailAlreadyExistException,
    NicknameAlreadyExistException
} from '@member/exceptions/member.exceptions';
import { MemberRole } from '@member/enums';
import { ApiCodeResponse } from '@core/api';

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

    /**
     * Retrieves a member by its unique identifier.
     *
     * This method attempts to load the member from the database using its ID.
     * If no matching member is found, a NotFoundException is thrown with the
     * standardized API error code MEMBER_NOT_FOUND.
     *
     * @param id - The unique identifier of the member to retrieve.
     * @returns The corresponding Member entity.
     * @throws NotFoundException When no member exists with the provided ID.
     */
    async findByIdOrFail(id: string): Promise<Member> {
        const member = await this.memberRepository.findOne({ where: { id } });
        
        if (!member) {
            throw new NotFoundException(ApiCodeResponse.MEMBER_NOT_FOUND); 
        }
        
        return member;
    }

    /**
     * Retrieves a member by its unique identifier.
     *
     * This method attempts to load the member from the database using its ID.
     * If no member is found, it returns null instead of throwing an exception.
     * This is useful for flows where the absence of a member is not considered
     * an error (e.g., logout, optional lookups).
     *
     * @param id - The unique identifier of the member to retrieve.
     * @returns The Member entity if found, otherwise null.
     */
    async findById(id: string): Promise<Member | null> {
        const member = await this.memberRepository.findOne({ where: { id } });
        
        if (!member){
            return null;
        }
        return member;
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
