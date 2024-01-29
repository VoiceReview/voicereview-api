import { Controller } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequest } from './dto/LoginRequest.dto';
import { RegisterRequest } from './dto/RegisterRequest.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { auth } from 'src/proto/interfaces/auth.interface';
import { RefreshTokens, Users } from 'src/database/database.types';
import { AccessTokenService } from 'src/access_token/access_token.service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import * as jwt from 'jsonwebtoken';
import { RefreshRequest } from './dto/RefreshRequest.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly accessTokensService: AccessTokenService,
        private readonly refreshTokensService: RefreshTokensService
    ) { }

    @GrpcMethod('AuthService', 'Login')
    async login(data: LoginRequest): Promise<auth.LoginResponse> {
        const { email, password } = data;
        try {
            const user = await this.getUserByEmail(email);

            const passwordMatch = await this.userService.comparePassword(password, user.password);
            if (!passwordMatch) {
                throw new Error('Wrong password');
            }
            const access_token = await this.createAccessToken(user.user_id);
            const refresh_token = await this.createRefreshToken(user.user_id);
            return {
                accessToken: access_token,
                refreshToken: refresh_token,
            };
        } catch (error) {
            throw this.handleLoginError(error);
        }
    }

    @GrpcMethod('AuthService', 'Register')
    async register(data: RegisterRequest): Promise<auth.RegisterResponse> {
        const { email, phone, password } = data;
        try {
            const user_insert_res = await this.userService.createOne({ email, phone, password, role: 2 });

            if (user_insert_res.rowCount === 0) {
                throw new Error('Failed to create user');
            }

            const createdUser = user_insert_res.rows[0] as Users;

            const access_token = await this.createAccessToken(createdUser.user_id);
            const refresh_token = await this.createRefreshToken(createdUser.user_id);

            return {
                accessToken: access_token,
                refreshToken: refresh_token,
            };
        } catch (error) {
            throw this.handleRegisterError(error);
        }
    }

    /**
     * Method to create a new access token
     * @param user_id the uuid value of the user 
     * @returns a promise that resolve to a new jwt access token
     */
    private async createAccessToken(user_id: string): Promise<string> {
        const access_token_insert_res = await this.accessTokensService.createOne(user_id);

        if (access_token_insert_res.rowCount === 0) {
            throw new Error('Failed to create access token');
        }

        const access_token = access_token_insert_res.rows[0];
        const access_token_jwt = jwt.sign(access_token, process.env.USER_SERVICE_ACCESS_TOKEN_SECRET);

        return access_token_jwt;
    }

    /**
     * Method to create a new refresh token
     * @param user_id the uuid value of the user 
     * @returns a promise that resolve to a new jwt refresh token
     */
    private async createRefreshToken(user_id: string): Promise<string> {
        const refresh_token_insert_res = await this.refreshTokensService.createOne(user_id);

        if (refresh_token_insert_res.rowCount === 0) {
            throw new Error('Failed to create refresh token');
        }

        const refresh_token = refresh_token_insert_res.rows[0] as RefreshTokens;
        const refresh_token_jwt = jwt.sign(refresh_token, process.env.USER_SERVICE_REFRESH_TOKEN_SECRET);

        return refresh_token_jwt;
    }

    /**
     * Method to get a user by email
     * @param email the email of the user
     * @returns a promise that resolve to the user
     */
    private async getUserByEmail(email: string) {
        const user_select_res = await this.userService.findOneByEmail(email);

        if (user_select_res.rowCount === 0) {
            throw new Error('User not found');
        }

        return user_select_res.rows[0] as Users;
    }

    /**
     * Method to handle login errors
     * @param error the error to handle
     * @returns an object containing the error code and message
     */
    private handleLoginError(error: Error): { code: number, message: string } {
        switch (error.message) {
            case 'User not found':
            case 'Wrong password':
                return {
                    code: 404,
                    message: 'No user found with the given credentials',
                };
            default:
                return {
                    code: 500,
                    message: 'Internal server error',
                };
        }
    }

    /**
     * Method to handle register errors
     * @param error the error to handle
     * @returns an object containing the error code and message
     */
    private handleRegisterError(error: Error): { code: number, message: string } {
        switch (error.message) {
            case 'Failed to create user':
                return {
                    code: 500,
                    message: 'Internal server error',
                };
            default:
                return {
                    code: 500,
                    message: 'Internal server error',
                };
        }
    }

    @GrpcMethod('AuthService', 'Refresh')
    async refresh(data: RefreshRequest): Promise<auth.RefreshResponse> {
        const { refreshToken } = data;

        try {
            const refresh_token_decoded = jwt.verify(refreshToken, process.env.USER_SERVICE_REFRESH_TOKEN_SECRET);
            const uuid_refresh_token = refresh_token_decoded['token'];

            const refresh_token_valid = await this.refreshTokensService.validateRefreshToken(uuid_refresh_token);
            if (!refresh_token_valid) {
                throw new Error('Invalid or expired refresh token');
            }

            const user_id = refresh_token_decoded['user_id'];
            const access_token = await this.createAccessToken(user_id);
            return {
                accessToken: access_token,
            };
        } catch (error) {
            throw this.handleRefreshError(error);
        }
    }

    /**
     * Method to handle refresh errors
     * @param error the error to handle
     * @returns an object containing the error code and message
     */
    private handleRefreshError(error: Error): { code: number, message: string } {
        switch (error.message) {
            case 'Invalid or expired refresh token':
                return {
                    code: 401,
                    message: 'Invalid or expired refresh token',
                };
            default:
                return {
                    code: 500,
                    message: 'Internal server error',
                };
        }
    }
}
