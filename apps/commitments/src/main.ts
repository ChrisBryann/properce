import { NestFactory } from '@nestjs/core';
import { CommitmentsModule } from './commitments.module';

async function bootstrap() {
  const app = await NestFactory.create(CommitmentsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
