import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential, Token } from '@security/entities';
import { ApiCodeResponse, ApiException } from '@core/api';

/**
 * Service responsible for managing refresh tokens associated with user credentials.
 *
 * - Each Credential can have exactly one Token entry.
 * - Tokens store the hashed refresh token used for session renewal.
 * - If a token does not exist for a credential, it is created.
 * - If it exists, it is updated.
 */
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

    /**
   * Creates or updates the refresh token linked to a given credential.
   *
   * Workflow:
   * - Validates that a credential is provided.
   * - Searches for an existing Token associated with the credential.
   * - Creates a new Token if none exists.
   * - Updates the hashed refresh token.
   * - Persists the Token entity.
   *
   * @param credential - The Credential entity owning the token.
   * @param hashedRefreshToken - The hashed refresh token to store.
   *
   * @throws ApiException
   * Thrown when the credential is missing (TOKEN_CREDENTIAL_MISSING).
   */
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
