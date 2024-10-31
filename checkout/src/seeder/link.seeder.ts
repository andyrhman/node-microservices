
import myDataSource from "../config/db.config";
import { DataSource } from "typeorm";
import { Order } from "../entity/order.entity";
import { Link } from "../entity/link.entity";
import { Product } from "../entity/product.entity";
import { OrderItem } from "../entity/order-item.entity";

const linkSeederSource = new DataSource({
    type: "postgres",
    host: '172.17.0.1', // ? Linux docker internal ip is 172.17.0.1
    port: parseInt('54323'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador',
    entities: [
        Link, Product, Order, OrderItem
    ],
    logging: false,
    synchronize: true
});

const startSeeding = async () => {
    try {
        // Initialize both data sources
        await linkSeederSource.initialize();
        await myDataSource.initialize();

        const links = await linkSeederSource.getRepository(Link).find({ relations: ["products"] });

        const repository = myDataSource.getRepository(Link);

        for (const link of links) {
            await repository.save(link);
        }
        console.log("Seeding has been completed");
    } catch (err) {
        console.error("Error during Data Source initialization or seeding:", err);
    } finally {
        await linkSeederSource.destroy();
        await myDataSource.destroy();
        process.exit(0);
    }
};

startSeeding();