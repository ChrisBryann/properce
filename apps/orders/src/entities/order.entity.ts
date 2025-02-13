import { DefaultEntity } from '@app/common/database/default.entity';
import { OrderStatus } from '@app/common/enums/order-status.enum';
import { ProductListing } from 'apps/listings/src/entities/product-listing.entity';
import { User } from 'apps/users/src/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order extends DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => ProductListing, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  listing: ProductListing;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  buyer: User;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  lockedAt: Date;

  @Column({
    type: 'text',
    nullable: false,
  })
  shippingAddress: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;
}
