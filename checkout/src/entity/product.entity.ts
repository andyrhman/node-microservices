import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column()
    price: number;
}