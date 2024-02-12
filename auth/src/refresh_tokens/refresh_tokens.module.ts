import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh_tokens.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.USER_SERVICE_REFRESH_TOKEN_SECRET
      })
    })
  ],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService]
})
export class RefreshTokensModule {}
