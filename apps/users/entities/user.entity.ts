import { UserRoles } from '@app/common';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['phone', 'email', 'id'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: UserRoles;

  @Column({
    default: false,
  })
  ktpVerified: boolean;

  @Column({
    default: false,
  })
  phoneVerified: boolean;

  @Column({
    default: false,
  })
  emailVerified: boolean;

  @Column({
    default: 0,
  })
  tokenVersion?: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshToken?: string;

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
