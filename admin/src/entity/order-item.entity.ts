import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    product_title: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column()
    ambassador_revenue: number;

    @Column()
    admin_revenue: number;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: "order_id" })
    order: Order;
}