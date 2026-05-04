import { Injectable } from "@nestjs/common";
import { Member } from "@member/entities";
import { Credential } from "@security/entities"
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CredentialService { 
  constructor( @InjectRepository(Credential) private readonly credentialRepository: Repository<Credential>) {}

  /**
   * Creates a new credential for the given member.
   */
  async create(member: Member, hashedPassword: string): Promise<Credential> {
    const credential = this.credentialRepository.create({
      password: hashedPassword,
      member,
    });

    return this.credentialRepository.save(credential);
  }
}
