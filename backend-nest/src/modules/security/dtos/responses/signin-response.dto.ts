import { ApiProperty } from '@nestjs/swagger';
import { MemberResponseDto } from '@member/dtos';

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class SigninResponseDto {
    @ApiProperty({
        type: MemberResponseDto,
        description: 'Authenticated member information',
    })
    user?: MemberResponseDto;

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
