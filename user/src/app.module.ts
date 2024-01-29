import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RefreshTokensModule } from './refresh_tokens/refresh_tokens.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenModule } from './access_token/access_token.module';

@Module({
  imports: [UserModule, RefreshTokensModule, ConfigModule.forRoot(), DatabaseModule, AuthModule, AccessTokenModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule { }
