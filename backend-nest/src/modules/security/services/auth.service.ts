import { Member } from '@member/entities';
import { MemberService } from '@member/services';
import { SignupDto } from '@security/dtos';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CredentialService } from '@security/services';
import * as bcrypt from 'bcrypt';

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);

@Injectable()
export class AuthService {
    /**
     * Constructs an instance of AuthService.
     *
     * @param memberService - The member service for creating and managing members.
     * @param credentialService - The credential service for creating member credentials.
     */
    constructor(
        private readonly memberService: MemberService,
        private readonly credentialService: CredentialService,
    ) {}

    /**
     * Signs up a new user by creating a user entity and their associated credentials.
     * Delegates validation to UserService and coordinates the transaction.
     * @param signupDto - The signup data transfer object containing the email and username of the new user.
     * @returns A promise that resolves to the newly created User entity.
     */
    @Transactional()
    async signup(signupDto: SignupDto): Promise<Member> {
        // Hash the password outside the transaction (save resources in DB)
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(signupDto.password, salt);

        // Creates a new member entity in the database
        const member = await this.memberService.create(
            signupDto.email,
            signupDto.nickname,
        );

        // Creates member credentials for the new member
        await this.credentialService.create(member, hashedPassword);

        return member;
    }
}
    