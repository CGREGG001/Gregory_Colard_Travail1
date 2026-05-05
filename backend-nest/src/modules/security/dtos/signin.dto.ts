import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

/*
 * Note: The "!" definite assignment assertions are required because TypeORM
 * initializes entity properties at runtime without using the constructor.
 * This bypasses strictPropertyInitialization while remaining aligned with
 * TypeORM best practices.
 */
export class SigninDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Member email address (stored in lowercase)',
    })
    @IsEmail()
    @MaxLength(255)
    email!: string;

    @ApiProperty({
        example: 'P@ssWord123!',
        description: 'Password must contain 100 char max',
        maxLength: 100,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    password!: string;
}
