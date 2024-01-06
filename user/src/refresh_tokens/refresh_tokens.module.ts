import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh_tokens.service';

@Module({
  providers: [RefreshTokensService]
})
export class RefreshTokensModule {}
