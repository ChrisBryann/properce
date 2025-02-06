import { CertificateType, PropertyType } from '@app/common';
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
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  type: string;

  @Column({
    length: 100,
  })
  province: string;

  @Column({
    length: 100,
  })
  city: string;

  @Column({
    length: 100,
  })
  district: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'enum',
    enum: CertificateType,
  })
  certificateType: CertificateType;

  @Column({
    default: false,
  })
  isSyariah: boolean;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sellerId: string;

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
    default: null, // cannot have a default value since it will cause postgres to assume it has been deleted
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  deletedAt: Date;
}
