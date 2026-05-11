import {
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToOne,
    JoinColumn,
    PrimaryColumn,
    BeforeInsert,
} from 'typeorm';
import { ulid } from 'ulid';
import { Member } from '@member/entities';

/**
 * Stores sensitive security information (hashed password).
 */
@Entity('credential')
export class Credential {
    @PrimaryColumn({
        type: 'varchar',
        length: 26,
        name: 'credential_id', // name of the column PK
        primaryKeyConstraintName: 'pk_credential' // explicite name of the PK
    })
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) {
        this.id = ulid();
        }
    }

    /**
     * Hash of the password (Bcrypt)
     */
    @Column({ name: 'password', select : false })
    password!: string; // hashed password

    @CreateDateColumn({ name: 'created_at' }) // Snake_case for DB
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', select : false })
    deletedAt!: Date;

    /**
     * Reference to the user who owns this credential.
     * @JoinColumn indicates that this table has the foreign key (user_id).
     */
    @OneToOne(() => Member, (member) => member.credential, { onDelete: 'CASCADE' })
    @JoinColumn({ 
        name: 'member_id',
        foreignKeyConstraintName: 'fk_credential_member'
    }) // FK(member_id)
    member!: Member;
}
