import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { user } from './interfaces/user.interface';
import { UserService } from './user.service';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly refreshTokensService: RefreshTokensService
    ) { }


    @GrpcMethod('UserService', 'FindOne')
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
    async createUser(data: user.CreateUserRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<user.CreateUserResponse> {
        if ((!data.email && !data.phone) || !data.password) {
            call.emit('error', { code: 400, message: 'Missing required fields' });
            return;
        }
        const { email, phone, password, role } = data;
        try {
            const user_insert_res = await this.userService.createOne({ email, phone, password, role });

            if (user_insert_res.rowCount === 0) {
                throw new Error('Failed to create user');
            }

            const user = user_insert_res.rows[0];

            const refresh_token_insert_res = await this.refreshTokensService.createOne({ user_id: user.user_id });
            
            if (refresh_token_insert_res.rowCount === 0) {
                throw new Error('Failed to create refresh token');
            }

            const refresh_token = refresh_token_insert_res.rows[0];
            const refresh_token_jwt = jwt.sign(refresh_token, process.env.REFRESH_TOKEN_SECRET);


            const response: user.CreateUserResponse = {
                refreshToken: refresh_token_jwt,
            }

            return response;
        } catch (error) {
            throw { code: Status.INTERNAL, message: error.message };
        }
    }
}
