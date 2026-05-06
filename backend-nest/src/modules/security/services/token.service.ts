import { Injectable } from '@nestjs/common';
import { Member } from '@member/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '@security/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async updateOrCreate(member: Member, hashedRefreshToken: string) {
    let token = await this.tokenRepository.findOne({ where: { credential: member.credential } });

    if (!token) {
      token = this.tokenRepository.create({ credential: member.credential });
    }

    token.hashedRefreshToken = hashedRefreshToken;
    await this.tokenRepository.save(token);
  }
}

