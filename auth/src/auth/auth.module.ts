import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RefreshTokensModule } from 'src/refresh_tokens/refresh_tokens.module';
import { AccessTokenModule } from 'src/access_token/access_token.module';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [
        RefreshTokensModule,
        AccessTokenModule,
        DatabaseModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
