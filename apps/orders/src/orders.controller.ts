import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({ cmd: 'getHello' })
  getHello(): string {
    return this.ordersService.getHello();
  }

  @EventPattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto);
  }

  @EventPattern('createOrderBulk')
  async createBulk(
    @Payload('createOrderDtos') createOrderDtos: CreateOrderDto[],
  ) {
    await this.ordersService.createBulk(createOrderDtos);
  }

  @MessagePattern({ cmd: 'getOrderById' })
  async findOne(@Payload('id') id: string) {
    return await this.ordersService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateOrderStatus' })
  async updateStatus(
    @Payload('id') id: string,
    @Payload('updateOrderStatusDto') updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
    );
  }
}
