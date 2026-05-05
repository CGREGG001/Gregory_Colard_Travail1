import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from '@security/entities/credential.entity';
import { Token } from '@security/entities/token.entity';
import { AuthService } from '@security/services/auth.service';
import { CredentialService } from '@security/services/credential.service';
import { MemberModule } from '@member/member.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Credential, Token]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '1h',
                },
            }),
        }),
        MemberModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        CredentialService,
    ],
    exports: [AuthService],
})
export class SecurityModule {}
