import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common/rmq/rmq.service';
import { AUTH_RMQ } from '@app/common/constants/rmq-name.constant';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(AUTH_RMQ, true));
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
