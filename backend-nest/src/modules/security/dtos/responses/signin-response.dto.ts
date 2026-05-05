import { ApiProperty } from '@nestjs/swagger';
import { MemberDto } from '@member/dtos';

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class SigninResponseDto {
    @ApiProperty({
        type: MemberDto,
        description: 'Authenticated member information',
    })
    user?: MemberDto;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    })
    accessToken?: string;
    
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token',
    })
    refreshToken?: string;

    @ApiProperty({
        example: 3600,
        description: 'Access token expiration time in seconds',
    })
    expiresIn?: number;
}
