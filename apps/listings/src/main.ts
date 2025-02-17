import { NestFactory } from '@nestjs/core';
import { ListingsModule } from './listings.module';
import { ValidationPipe } from '@nestjs/common';
import { TcpOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ListingsModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<TcpOptions>({
    transport: Transport.TCP,
    options: {
      host: 'listings',
      port: 3001,
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
