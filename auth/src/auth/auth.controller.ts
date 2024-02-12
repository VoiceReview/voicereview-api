import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { auth } from 'src/auth/interfaces/auth.interface';
import { RefreshTokens, Users } from 'src/database/database.types';
import { AccessTokenService } from 'src/access_token/access_token.service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @GrpcMethod('AuthService', 'Login')
    async login(data: auth.LoginRequest): Promise<auth.LoginResponse> {
        return this.authService.login(data);
    }

    @GrpcMethod('AuthService', 'Register')
    async register(data: auth.RegisterRequest): Promise<auth.RegisterResponse> {
        return this.authService.register(data);
    }

    @GrpcMethod('AuthService', 'Refresh')
    async refresh(data: auth.RefreshRequest): Promise<auth.RefreshResponse> {
        return this.authService.refreshAccessToken(data);
    }
}
