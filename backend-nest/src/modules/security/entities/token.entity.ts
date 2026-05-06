import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn
} from 'typeorm';
import { ulid } from 'ulid';
import { Credential } from './credential.entity';

/*
 * Persists authentication session tokens (JWT and Refresh Tokens) linked to a user's credentials.
 */
@Entity('token')
export class Token {
    @PrimaryColumn({
        type: 'varchar',
        length: 26,
        name: 'token_id', // name of the column PK
        primaryKeyConstraintName: 'pk_token' // explicite name of the PK
    })
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) {
        this.id = ulid();
        }
    }

    @Column({ 
        name: 'hashed_refresh_token',
        type: 'varchar',
        length: 255,
        nullable: true 
    })
    hashedRefreshToken!: string | null;

    @OneToOne(() => Credential,{ eager: true, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'credential_id',
        foreignKeyConstraintName: 'fk_token_credential'
    })
    credential!: Credential;
}
