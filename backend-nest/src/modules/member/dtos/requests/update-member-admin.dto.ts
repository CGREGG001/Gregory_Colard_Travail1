import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { MemberRole } from '../../enums/member-role.enum';

export class UpdateMemberAdminDto {
    @ApiPropertyOptional({ example: 'membre@email.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'PseudoMembre' })
    @IsOptional()
    @IsString()
    @Length(3, 20)
    nickname?: string;

    @ApiPropertyOptional({ enum: MemberRole, example: MemberRole.ADMIN })
    @IsOptional()
    @IsEnum(MemberRole)
    role?: MemberRole;
}
