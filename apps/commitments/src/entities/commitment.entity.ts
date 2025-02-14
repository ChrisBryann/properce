import { DefaultEntity } from "@app/common/database/default.entity";
import { ProductListing } from "apps/listings/src/entities/product-listing.entity";
import { User } from "apps/users/src/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Commitment extends DefaultEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => ProductListing, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn()
    listing: ProductListing;

    @ManyToOne(type=> User, {
        onDelete: 'CASCADE',
        nullable: false
    })
    @JoinColumn()
    buyer: User;

    @Column({
        type: 'int'
    })
    quantity: number;
}