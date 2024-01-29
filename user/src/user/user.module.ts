import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { RefreshTokensModule } from 'src/refresh_tokens/refresh_tokens.module';
import { AccessTokenModule } from 'src/access_token/access_token.module';

@Module({
  imports: [
    DatabaseModule,
    AccessTokenModule,
    RefreshTokensModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
