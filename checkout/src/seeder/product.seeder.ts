import myDataSource from "../config/db.config";
import { Product } from "../entity/product.entity";
import { DataSource } from "typeorm";

const productSeederSource = new DataSource({
    type: "postgres",
    host: '172.17.0.1', // ? Linux docker internal ip is 172.17.0.1
    port: parseInt('54323'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador',
    entities: [
        Product
    ],
    logging: false,
    synchronize: true
});

const startSeeding = async () => {
    try {
        // Initialize both data sources
        await productSeederSource.initialize();
        await myDataSource.initialize();

        const products = await productSeederSource.getRepository(Product).find();

        const repository = myDataSource.getRepository(Product);

        for (const product of products) {
            await repository.save(product);
        }

        console.log("Seeding has been completed");
    } catch (err) {
        console.error("Error during Data Source initialization or seeding:", err);
    } finally {
        await productSeederSource.destroy();
        await myDataSource.destroy();
        process.exit(0);
    }
};

startSeeding();