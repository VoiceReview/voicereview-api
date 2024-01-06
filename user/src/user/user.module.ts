import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { RefreshTokensModule } from 'src/refresh_tokens/refresh_tokens.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(__dirname, 'user.proto'),
        }
      }
    ]),
    DatabaseModule,
    RefreshTokensModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
