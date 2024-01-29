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

    const metadata = context.getArgs()[1].internalRepr; // A map representing the metadata sent with the request
    const accessTokenArray = metadata.get('access_token'); // Retrieve the array for the 'access_token' key

    if (!accessTokenArray || accessTokenArray.length === 0) {
      throw new UnauthorizedException('No access token provided');
    }

    const accessToken = accessTokenArray[0]

    return this.validateAccessToken(accessToken);
  }

  /**
   * Method to validate an access token
   * @param jwtAccessToken a jwt access token
   * @returns a boolean indicating whether the access token is valids
   */
  private async validateAccessToken(jwtAccessToken: string): Promise<boolean> {
    try {
      const accessToken = jwt.verify(jwtAccessToken, process.env.USER_SERVICE_ACCESS_TOKEN_SECRET);
      const uuidAccessToken = accessToken['token'];
      const tokenValid = await this.accessTokenService.validateAccessToken(uuidAccessToken);
      return tokenValid;
    } catch (err) {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
