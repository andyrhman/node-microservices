import myDataSource from "../config/db.config";
import { Order as OrderEntity } from "../entity/order.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DataSource } from "typeorm";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    transaction_id: string;

    @Column()
    user_id: string;

    @Column()
    code: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    order_items: OrderItem[];
}

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ambassador_revenue: number;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: "order_id" })
    order: Order;
}

const orderSeederSource = new DataSource({
    type: "postgres",
    host: '172.17.0.1', // ? Linux docker internal ip is 172.17.0.1
    port: parseInt('54323'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador',
    entities: [
        Order, OrderItem
    ],
    logging: false,
    synchronize: true
});

const startSeeding = async () => {
    try {
        // ! The entity for Order and OrderItem is different for seeder
        // ! We use the entity define at Order & Orderitem at top
        await orderSeederSource.initialize();
        await myDataSource.initialize();

        const orders = await orderSeederSource.getRepository(Order).find({ relations: ["order_items"] });

        const orderRepository = myDataSource.getRepository(OrderEntity);

        for (const order of orders) {
            let total = 0;

            for (const orderItem of order.order_items) {
                total += orderItem.ambassador_revenue;
            }

            await orderRepository.save({
                id: order.id,
                user_id: order.user_id,
                code: order.code,
                total
            });
        }
        console.log("Seeding has been completed");
    } catch (err) {
        console.error("Error during Data Source initialization or seeding:", err);
    } finally {
        await orderSeederSource.destroy();
        await myDataSource.destroy();
        process.exit(0);
    }
};

startSeeding();