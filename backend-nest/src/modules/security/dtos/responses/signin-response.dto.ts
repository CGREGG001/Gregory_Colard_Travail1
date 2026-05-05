import { MemberDto } from '@member/dtos';

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class SigninResponseDto {
    user?: MemberDto;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
}
