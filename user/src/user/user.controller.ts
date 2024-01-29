import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { user } from './interfaces/user.interface';
import { UserService } from './user.service';
import { RefreshTokensService } from 'src/refresh_tokens/refresh_tokens.service';
import { AccessTokenService } from 'src/access_token/access_token.service';
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
}
