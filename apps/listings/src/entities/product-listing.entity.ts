import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { DefaultEntity } from '@app/common/database/default.entity';

@Entity()
export class ProductListing extends DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  product: Product;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  proposedPrice: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  minThreshold: number; // minimum number of buyers required for sale

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  deadline: Date; // end time for buyer commitments

  @Column({
    type: 'boolean',
    default: false,
  })
  locked: boolean; // indicates if threshold was met

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  finalPrice?: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  expired: boolean; // indicates if listing has gone over deadline and minThreshold was not met
}
