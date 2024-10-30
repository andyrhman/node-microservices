import seederSource from "../config/seeder.comfig";
import myDataSource from "../config/db.config";
import { Link } from "../entity/link.entity";

const startSeeding = async () => {
    try {
        // Initialize both data sources
        await seederSource.initialize();
        await myDataSource.initialize();

        const links = await seederSource.getRepository(Link).find({ relations: ["products"] });

        const repository = myDataSource.getRepository(Link);

        for (const link of links) {
            await repository.save(link);
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