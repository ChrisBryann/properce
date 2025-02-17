import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env.development',
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_HOST'),
            port: +configService.getOrThrow<string>('AUTH_PORT'),
          },
        }),
      },
      {
        name: 'COMMITMENTS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('COMMITMENTS_HOST'),
            port: +configService.getOrThrow<string>('COMMITMENTS_PORT'),
          },
        }),
      },
      {
        name: 'LISTINGS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('LISTINGS_HOST'),
            port: +configService.getOrThrow<string>('LISTINGS_PORT'),
          },
        }),
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('NOTIFICATIONS_HOST'),
            port: +configService.getOrThrow<string>('NOTIFICATIONS_PORT'),
          },
        }),
      },
      {
        name: 'ORDERS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('ORDERS_HOST'),
            port: +configService.getOrThrow<string>('ORDERS_PORT'),
          },
        }),
      },
      {
        name: 'PAYMENTS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('PAYMENTS_HOST'),
            port: +configService.getOrThrow<string>('PAYMENTS_PORT'),
          },
        }),
      },
      {
        name: 'USERS_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('USERS_HOST'),
            port: +configService.getOrThrow<string>('USERS_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [GatewayController, AuthController],
  providers: [GatewayService],
})
export class GatewayModule {}
