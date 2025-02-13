import { OrderStatus } from "@app/common/enums/order-status.enum";
import { ProductListing } from "apps/listings/src/entities/product-listing.entity";
import { User } from "apps/users/src/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => ProductListing, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    productListing: ProductListing;

    @ManyToOne(type => User, {
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