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
    createdAt?: Date;
    updatedAt?: Date;
}
