import { PaymentStatus } from '@app/common';
import { DefaultEntity } from '@app/common/database/default.entity';
import { Order } from 'apps/orders/src/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment extends DefaultEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 255,
  })
  invoiceId: string; // Xendit invoice ID

  @ManyToOne(() => Order, {
    onDelete: 'SET NULL',
    nullable: false,
  })
  @JoinColumn()
  order: Order;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Pending,
  })
  status: PaymentStatus;

  @Column({
    length: 50,
  })
  paymentChannel: string; // OVO, Bank Transfer, Alfamart
}
