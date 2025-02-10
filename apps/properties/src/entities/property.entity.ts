import { CertificateType, PropertyType } from '@app/common';
import { User } from 'apps/users/src/entities/user.entity';
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
import { Province } from './province.entity';
import { City } from './city.entity';
import { District } from './district.entity';

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
  type: PropertyType;

  @ManyToOne((type) => Province)
  @JoinColumn()
  province: string;

  @ManyToOne((type) => City)
  @JoinColumn()
  city: string;

  @ManyToOne((type) => District)
  @JoinColumn()
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
