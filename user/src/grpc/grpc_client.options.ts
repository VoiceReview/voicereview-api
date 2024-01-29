import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

@Injectable()
export class GrpcClientOptions {
  constructor(
    private readonly configService: ConfigService
  ) { }

  get getGRPCConfig(): GrpcOptions {
    const grpcPort = this.configService.get<number>('USER_SERVICE_PORT');
    const grpcHost = this.configService.get<string>('USER_SERVICE_HOST');

    return addReflectionToGrpcConfig({
      transport: Transport.GRPC,
      options: {
        url: `${grpcHost}:${grpcPort}`,
        package: 'auth',
        protoPath: join(__dirname, '../proto/auth.proto'),
        loader: {
          oneofs: true,
          includeDirs: [join(__dirname, '../proto')],
        },
      }
    });
  }
}