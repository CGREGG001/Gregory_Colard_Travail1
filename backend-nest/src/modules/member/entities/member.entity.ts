import { 
    BeforeInsert,
    Column,
    Entity,
    Index,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Credential } from '@security/entities';
import { MemberRole } from '@member/enums';
import { BaseEntity } from '@core/model';
import { Recipe } from '@recipe/entities';

/**
 * Represents the public profile and metadata of a member.
 * 
 * Note: The "!" definite assignment assertions are required because TypeORM
 * initializes entity properties at runtime without using the constructor.
 * This bypasses strictPropertyInitialization while remaining aligned with
 * TypeORM best practices.
 */
@Entity('member')
export class Member extends BaseEntity {
    @PrimaryColumn({
        type: 'varchar',
        length: 26,
        name: 'member_id', // name of the column PK
        primaryKeyConstraintName: 'pk_member' // explicite name of the PK
    })
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) {
        this.id = ulid();
        }
    }

    @Column()
    @Index('uq_member_email', { unique: true }) // Explicit constraint name for AuthService
    email!: string;

    @Column()
    @Index('uq_member_nickname', { unique: true }) // Explicit constraint name for AuthService
    nickname!: string;

    // Role of the member for managing permissions.
    @Column({ name: 'member_role', type: 'enum', enum: MemberRole, nullable: false })
    role!: MemberRole;

    /**
     * Relation to the connection identifiers (passwords).
     * Using a function arrow to avoid circular dependency issues.
     */
    @OneToOne(() => Credential, (credential) => credential.member)
    credential!: Credential;

    /**
     * Relation to the authored recipes.
     * A member can create multiple recipes, establishing a one‑to‑many link.
     */
    @OneToMany(() => Recipe, (recipe) => recipe.author)
    recipes!: Recipe[];
}
