import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential, Token } from '@security/entities';
import { ApiCodeResponse, ApiException } from '@core/api';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

  async updateOrCreate(credential: Credential, hashedRefreshToken: string) {
    if (!credential) {
        throw new ApiException(ApiCodeResponse.TOKEN_CREDENTIAL_MISSING, 500)
    }

    let token = await this.tokenRepository.findOne({ 
      where: { credential : { id: credential.id } }
    });

    if (!token) {
      token = this.tokenRepository.create({ credential });
    }

    token.hashedRefreshToken = hashedRefreshToken;
    await this.tokenRepository.save(token);
  }
}
