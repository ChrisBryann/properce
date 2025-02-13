import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../products/entities/product.entity";

@Entity()
export class ProductListing {
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
    finalPrice?: string;

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