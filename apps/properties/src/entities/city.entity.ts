import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class City {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        type: 'uuid'
    })
    provinceId: string;
}