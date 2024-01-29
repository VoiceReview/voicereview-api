import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { RefreshTokensModule } from 'src/refresh_tokens/refresh_tokens.module';
import { AccessTokenModule } from 'src/access_token/access_token.module';

@Module({
    imports: [
        UserModule,
        RefreshTokensModule,
        AccessTokenModule
    ],
    controllers: [AuthController],
})
export class AuthModule { }
