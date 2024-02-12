import { Module } from '@nestjs/common';
import { AccessTokenService } from './access_token.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.USER_SERVICE_ACCESS_TOKEN_SECRET
      })
    })
  ],
  providers: [AccessTokenService],
  exports: [AccessTokenService]
})
export class AccessTokenModule {}
