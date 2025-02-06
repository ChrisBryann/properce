import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class PropertyImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Property, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  propertyId: string;

  @Column({
    length: 255,
  })
  url: string;
}
