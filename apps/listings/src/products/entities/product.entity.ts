import { ProductCondition } from "@app/common/enums/product-condition.enum";
import { User } from "apps/users/src/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn()
    seller: User;

    @Column( {
        length: 255,
        nullable: false,
    })
    title: string;

    @Column({
        type: 'text',
    })
    description?: string;

    @Column({
        length: 100
    })
    category?: string;

    @Column({
        type: 'enum',
        enum: ProductCondition,
    })
    condition: ProductCondition;

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