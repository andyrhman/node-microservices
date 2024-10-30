import seederSource from "../config/seeder.comfig";
import { createClient } from "redis";
import { Order } from "../entity/order.entity";
import { UserService } from "../service/user.service";

seederSource.initialize().then(async () => {
    const client = createClient({
        url: `redis://redis:6379`
    });

    await client.connect();

    const users = await UserService.get('users');

    const orderRepository = seederSource.getRepository(Order);

    for (const user of users) {
        if (user['is_ambassador']) {
            const orders = await orderRepository.find({
                where: {
                    user_id: user['id']
                }
            });

            const revenue = orders.reduce((s, o) => s + o.total, 0);

            await client.zAdd('rankings', {
                value: user.fullName,
                score: revenue
            });
        }
    }

    console.info("🌱 Seeding has been completed");
    process.exit(0);
}).catch((err) => {
    console.error(err);
});