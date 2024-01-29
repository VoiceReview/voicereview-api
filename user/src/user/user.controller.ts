import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { user } from './interfaces/user.interface';
import { UserService } from './user.service';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import * as jwt from 'jsonwebtoken';
import { AccessTokenService } from 'src/access_token/access_token.service';
import { CreateUserRequest } from './dto/createUserRequest.dto';
import { RefreshTokens, Users } from 'src/database/database.types';
import { Auth } from 'src/auth/auth.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly accessTokensService: AccessTokenService,
        private readonly refreshTokensService: RefreshTokensService
    ) { }
    
    @GrpcMethod('UserService', 'FindOne')
    @Auth()
    findOne(data: user.UserByUuid, metadata: Metadata, call: ServerUnaryCall<any, any>): user.User {
        return {
            uuid: 'uuid',
            email: 'email',
            phone: 'phone',
            password: 'password',
            verified: true,
            role: user.UserRole.ADMIN,
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        };
    }

    @GrpcMethod('UserService', 'CreateUser')
    async createUser(data: CreateUserRequest): Promise<user.CreateUserResponse> {
        const { email, phone, password, role } = data;
        try {
            const user_insert_res = await this.userService.createOne({ email, phone, password, role });

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
            throw this.handleCreateUserError(error);
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

    private handleCreateUserError(error: Error): { code: Status, message: string } {
        console.log(error);
        if (error.message.includes('duplicate key value violates unique constraint')) {
            return { code: Status.ALREADY_EXISTS, message: 'User already exists' };
        }
        return { code: Status.INTERNAL, message: 'Failed to create user' };
    }
}
