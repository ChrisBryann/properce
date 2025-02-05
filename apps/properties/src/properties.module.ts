import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  imports: [],
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
