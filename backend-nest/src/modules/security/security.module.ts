import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from '@security/entities/credential.entity';
import { Token } from '@security/entities/token.entity';
import { AuthService } from '@security/services/auth.service';
import { CredentialService } from '@security/services/credential.service';
import { MemberModule } from '@member/member.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Credential, Token]),
        MemberModule
    ],
    controllers: [],
    providers: [
        AuthService,
        CredentialService,
    ],
    exports: [AuthService],
})
export class SecurityModule {}
