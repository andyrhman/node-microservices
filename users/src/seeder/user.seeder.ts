import seederSource from "../config/seeder.comfig";
import myDataSource from "../config/db.config";
import { User } from "../entity/user.entity";

const startSeeding = async () => {
  try {
    // Initialize both data sources
    await seederSource.initialize();
    await myDataSource.initialize();

    const users = await seederSource.getRepository(User).find();

    const save_user = myDataSource.getRepository(User);

    for (const user of users) {
      await save_user.save(user);
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
