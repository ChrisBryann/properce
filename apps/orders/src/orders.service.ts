import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from '@app/common/enums/order-status.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { ORDERS_BMQ } from '@app/common/bullmq/bullmq.constant';
import { Queue } from 'bullmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectQueue(ORDERS_BMQ) private readonly ordersQueue: Queue,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(createOrderDto: CreateOrderDto) {
    // create orders based off the commitment id

    const order = await this.findOneByCommitment(createOrderDto.commitmentId);
    // if an order with the given commitment Id exists already, then throw error
    if (order) {
      throw new ForbiddenException(
        'Order with the given commitment ID already exist!',
      );
    }

    const orders = await this.ordersRepository.create(createOrderDto);

    return await this.ordersRepository.save(orders);
  }

  async createBulk(createOrderDtos: CreateOrderDto[]) {
    await this.ordersQueue.addBulk(
      createOrderDtos.map((createOrderDto) => ({
        name: 'createOrder',
        data: createOrderDto,
        opts: {
          removeOnComplete: true,
          removeOnFail: false,
        },
      })),
    );
  }

  async findOneByCommitment(commitmentId: string) {
    return await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoin('order.commitment', 'commitment')
      .addSelect('commitment.id')
      .where('commitment.id = :id', { id: commitmentId })
      .getOne();
  }

  async findOne(id: string) {
    const order = await this.ordersRepository
      .createQueryBuilder('order')
      .leftJoin('order.commitment', 'commitment')
      .addSelect('commitment.id')
      .leftJoin('order.buyer', 'buyer')
      .addSelect('buyer.id')
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new NotFoundException('Order does not exist!');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findOne(id);

    await this.ordersRepository.update(
      {
        id,
      },
      {
        status,
      },
    );

    return this.findOne(id);
  }
}
