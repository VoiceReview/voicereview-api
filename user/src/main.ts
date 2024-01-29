import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { GrpcClientOptions } from './grpc/grpc_client.options';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();
  const grpcClientOptions = new GrpcClientOptions(configService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcClientOptions.getGRPCConfig,
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
