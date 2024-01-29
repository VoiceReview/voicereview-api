import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenService } from 'src/access_token/access_token.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAuth = this.reflector.get<boolean>('isAuth', context.getHandler());
    if (!isAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('No access token provided');
    }

    return this.validateAccessToken(accessToken);
  }

  /**
   * Method to validate an access token
   * @param jwtAccessToken a jwt access token
   * @returns a boolean indicating whether the access token is valids
   */
  private async validateAccessToken(jwtAccessToken: string): Promise<boolean> {
    try {
      const uuidAccessToken = jwt.verify(jwtAccessToken, process.env.USER_SERVICE_ACCESS_TOKEN_SECRET); 
      const tokenValid = await this.accessTokenService.validateAccessToken(uuidAccessToken);
      return tokenValid;
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
