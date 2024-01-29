import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, 'user/user.proto'),
        url: `${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}`
      },
    });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
