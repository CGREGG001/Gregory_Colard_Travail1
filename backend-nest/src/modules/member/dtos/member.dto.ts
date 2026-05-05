import { MemberRole } from "@member/enums";

/**
 * DTO used for input/output validation.
 * All properties are optional because DTOs are instantiated
 * by class-transformer and not via a constructor.
 * This avoids strictPropertyInitialization errors.
 */
export class MemberDto {
    id?: string;
    email?: string;
    nickname?: string;
    role?: MemberRole;
    createdAt?: Date;
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
