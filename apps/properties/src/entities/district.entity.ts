import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class District {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        type: 'uuid'
    })
    cityId: string;
}