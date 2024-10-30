import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Link } from "./link.entity";

@Entity('orders')
export class Order {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    code: string;

    @Column({ nullable: true })
    total: number;

    @ManyToOne(() => Link, link => link.orders, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'code',
        name: 'code'
    })
    links: Link;

}