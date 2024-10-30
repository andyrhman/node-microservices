
import seederSource from "../config/seeder.comfig";
import myDataSource from "../config/db.config";
import { Order } from "../entity/order.entity";

const startSeeding = async () => {
    try {
        // Initialize both data sources
        await seederSource.initialize();
        await myDataSource.initialize();

        const orders = await seederSource.getRepository(Order).find({ relations: ["order_items"] });

        const orderRepository = myDataSource.getRepository(Order);

        for (const order of orders) {
            await orderRepository.save(order);
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