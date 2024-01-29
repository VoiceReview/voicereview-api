import { Controller } from '@nestjs/common';
import { AccessTokenService } from './access_token.service';

@Controller('access-token')
export class AccessTokenController {
  constructor(private readonly accessTokenService: AccessTokenService) {}
}
