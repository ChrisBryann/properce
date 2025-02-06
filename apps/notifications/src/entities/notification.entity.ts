import { NotificationStatus, NotificationType } from "@app/common";
import { User } from "apps/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    userId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({
        type: 'text'
    })
    content: string;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.Pending,
    })
    status: NotificationStatus;

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