import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller('user')
export class UserController {
    @GrpcMethod('UserService', 'FindOne')
    findOne(data: UserByUuid, metadata: Metadata, call: ServerUnaryCall<any, any>): User {
        return {
            uuid: '123',
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}
