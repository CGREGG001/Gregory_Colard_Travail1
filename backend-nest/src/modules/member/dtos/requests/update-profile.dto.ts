import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'nouveau@email.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'NouveauPseudo' })
    @IsOptional()
    @IsString()
    @Length(3, 20)
    nickname?: string;
}
