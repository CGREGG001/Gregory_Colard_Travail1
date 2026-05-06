import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MemberModule } from '@member/member.module';
import { AuthController } from '@security/auth.controller';
import { AuthService } from '@security/services/auth.service';
import { CredentialService } from '@security/services/credential.service';
import { Credential } from '@security/entities/credential.entity';
import { Token } from '@security/entities/token.entity';
import { JwtStrategy } from '@security/strategies';

@Module({
    imports: [
        TypeOrmModule.forFeature([Credential, Token]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET missing');
                }

                return {
                    secret,
                };
            },
        }),
        MemberModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        CredentialService,
        JwtStrategy
    ],
    exports: [AuthService],
})
export class SecurityModule {}
