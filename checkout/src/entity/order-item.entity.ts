import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    product_title: string;

    @Column({ nullable: true })
    price: number;

    @Column({ nullable: true })
    quantity: number;

    @Column({ nullable: true })
    ambassador_revenue: number;

    @Column({ nullable: true })
    admin_revenue: number;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: "order_id" })
    order: Order;
}