import { Module } from '@nestjs/common';
import { AccessTokenService } from './access_token.service';
import { AccessTokenController } from './access_token.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccessTokenController],
  providers: [AccessTokenService],
  exports: [AccessTokenService]
})
export class AccessTokenModule {}
