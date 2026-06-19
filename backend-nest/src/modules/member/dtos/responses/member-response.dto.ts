import { ApiProperty } from "@nestjs/swagger";
import { MemberRole } from "@member/enums";
import { Member } from "@member/entities";

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class MemberResponseDto {
    @ApiProperty({
        example: '01KQW3E4SQY40KNJ66TER4EB1G',
        description: 'Unique member identifier',
    })
    id?: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Member email address (stored in lowercase)',
    })
    email?: string;

    @ApiProperty({
        example: 'Doe',
        minLength: 2,
        maxLength: 50,
        description: 'Public nickname of the member',
    })
    nickname?: string;

    @ApiProperty({
        example: 'user',
        description: 'Role assigned to the member',
    })
    role?: MemberRole;

    @ApiProperty({
        example: '2026-05-05T12:57:32.162Z',
        description: 'Creation timestamp',
    })
    createdAt?: Date;

    @ApiProperty({
        example: '2026-05-05T12:57:32.162Z',
        description: 'Last update timestamp',
    })
    updatedAt?: Date;

    /**
     * Maps a Member entity to a MemberDto.
     * 
     * @param member - The Member entity from the database.
     * @returns A mapped MemberDto.
     */
    static fromEntity(member: Member): MemberResponseDto {
        const dto = new MemberResponseDto();
        
        dto.id = member.id;
        dto.email = member.email;
        dto.nickname = member.nickname;
        dto.role = member.role;
        dto.createdAt = member.createdAt;
        dto.updatedAt = member.updatedAt;

        return dto;
    }
}
