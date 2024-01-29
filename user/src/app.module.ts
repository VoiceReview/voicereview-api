import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RefreshTokensModule } from './refresh_tokens/refresh_tokens.module';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenModule } from './access_token/access_token.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { GrpcClientOptions } from './grpc/grpc_client.options';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    UserModule, 
    RefreshTokensModule, 
    DatabaseModule, 
    AccessTokenModule, 
    AuthModule,
    GrpcReflectionModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const grpcClientOptions: GrpcClientOptions = new GrpcClientOptions(configService);
        return grpcClientOptions.getGRPCConfig;
      },
      inject: [ConfigService],

    }),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
