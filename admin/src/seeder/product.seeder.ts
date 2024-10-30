import seederSource from "../config/seeder.comfig";
import myDataSource from "../config/db.config";
import { Product } from "../entity/product.entity";

const startSeeding = async () => {
    try {
        // Initialize both data sources
        await seederSource.initialize();
        await myDataSource.initialize();

        const products = await seederSource.getRepository(Product).find();

        const repository = myDataSource.getRepository(Product);

        for (const product of products) {
            await repository.save(product);
        }

        console.log("Seeding has been completed");
    } catch (err) {
        console.error("Error during Data Source initialization or seeding:", err);
    } finally {
        await seederSource.destroy();
        await myDataSource.destroy();
        process.exit(0);
    }
};

startSeeding();