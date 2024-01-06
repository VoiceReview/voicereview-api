import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SessionsModule } from './sessions/sessions.module';
import { RefreshTokensModule } from './refresh_tokens/refresh_tokens.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [UserModule, SessionsModule, RefreshTokensModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}