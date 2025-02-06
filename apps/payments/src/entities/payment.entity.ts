import { PaymentStatus } from '@app/common';
import { Property } from 'apps/properties/src/entities/property.entity';
import { User } from 'apps/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    length: 255,
  })
  invoice_id: string; // Xendit invoice ID

  @ManyToOne(() => Property, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  propertyId: string;

  @ManyToOne(() => User, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  buyerId: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
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

  @Column({
    default: false,
  })
  isSyariah: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    default: null, // cannot have a default value since it will causepostgres to assume it has been deleted
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  deletedAt: Date;
}
