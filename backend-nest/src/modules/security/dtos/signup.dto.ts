import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
    @ApiProperty({
        example: 'Doe',
        description: 'Unique public nickname',
        minLength: 2,
        maxLength: 50,
    })
    @MinLength(2)
    @MaxLength(50)
    readonly nickname!: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Member email address (stored in lowercase)',
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'P@ssWord123!',
        description: 'Password must contain 100 char max',
        maxLength: 100,
    })
    @IsString()
    @MaxLength(100)
    password!: string;
}