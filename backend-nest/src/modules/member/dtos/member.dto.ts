import { ApiProperty } from "@nestjs/swagger";
import { MemberRole } from "@member/enums";

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class MemberDto {
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

    constructor(partial: Partial<MemberDto>) {
        this.id = partial.id;
        this.email = partial.email;
        this.nickname = partial.nickname;
        this.role = partial.role;
        this.createdAt = partial.createdAt;
        this.updatedAt = partial.updatedAt;
    }
}
