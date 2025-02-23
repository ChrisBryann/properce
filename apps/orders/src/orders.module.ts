import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BmqModule } from '@app/common/bullmq/bullmq.module';
import { ORDERS_BMQ } from '@app/common/bullmq/bullmq.constant';

@Module({
  imports: [BmqModule.register([ORDERS_BMQ])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
