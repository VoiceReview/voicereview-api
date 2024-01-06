import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh_tokens.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService]
})
export class RefreshTokensModule {}
