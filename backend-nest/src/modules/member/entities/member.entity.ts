import { 
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from 'typeorm';
import { ulid } from 'ulid';
import { Credential } from '@security/entities';
import { MemberRole } from '@member/enums';

/**
 * Represents the public profile and metadata of a member.
 * 
 * Note: The "!" definite assignment assertions are required because TypeORM
 * initializes entity properties at runtime without using the constructor.
 * This bypasses strictPropertyInitialization while remaining aligned with
 * TypeORM best practices.
 */
@Entity('member')
export class Member {
    @PrimaryColumn('varchar', { length: 26 })
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
    @Index('uq_member_nickName', { unique: true }) // Explicit constraint name for AuthService
    nickName!: string;

    // Role of the member for managing permissions.
    @Column({ name: 'member_role', type: 'enum', enum: MemberRole, nullable: false })
    role!: MemberRole;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt!: Date;

    /**
     * Relation to the connection identifiers (passwords).
     * Using a function arrow to avoid circular dependency issues.
     */
    @OneToOne(() => Credential, (credential) => credential.member)
    credential!: Credential;
}
