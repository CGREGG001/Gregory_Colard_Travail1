import { Injectable } from "@nestjs/common";
import { Member } from "@member/entities";
import { Credential } from "@security/entities"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * Service responsible for managing user credentials.
 *
 * - Stores hashed passwords.
 * - Retrieves credentials linked to a Member.
 * - Ensures password fields are explicitly selected when needed.
 */
@Injectable()
export class CredentialService { 
  constructor( @InjectRepository(Credential) private readonly credentialRepository: Repository<Credential>) {}

  /**
   * Creates a new credential for the given member.
   * 
   * @param member - The member entity to associate with these credentials.
   * @param hashedPassword - The pre-hashed password string.
   * @returns A Promise that resolves to the created Credential entity.
   */
  async create(member: Member, hashedPassword: string): Promise<Credential> {
    const credential = this.credentialRepository.create({
      password: hashedPassword,
      member,
    });

    return this.credentialRepository.save(credential);
  }

  /**
   * Retrieves the credentials associated with a specific member.
   * 
   * Note:
   * - Password is normally excluded by default (select: false).
   * - This method explicitly selects the password field.
   * 
   * @param member - The member entity whose credentials are being retrieved.
   * @returns A Promise that resolves to the Credential entity if found, or null otherwise.
   */
  async findByMember(member: Member): Promise<Credential | null> {
    return this.credentialRepository.findOne({
      where: { member: { id: member.id } },
      select: ['id', 'password'] // <-- Force password selection beacause it is set to 'select: false'
    });
  }
}
