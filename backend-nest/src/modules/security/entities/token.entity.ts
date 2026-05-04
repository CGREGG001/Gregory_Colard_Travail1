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
    @PrimaryColumn('varchar', { length: 26 })
    id!: string;

    @BeforeInsert()
    setId() {
        if (!this.id) {
        this.id = ulid();
        }
    }

    @Column({ nullable: false })
    token!: string;

    @Column({ name: 'refresh_token', nullable: false })
    refreshToken!: string;

    @OneToOne(() => Credential,{ eager: true, onDelete: 'CASCADE' })
    @JoinColumn({name: 'credential_id'})
    credential!: Credential;
}
