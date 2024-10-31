import { connectDBKafka } from "./config";
import { Product } from "../entity/product.entity";
import { client } from "..";
import { Order } from "../entity/order.entity";

export class Subscriber {
    static async productCreated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);

        await client.del('products_frontend');
        await client.del('products_backend');
    }

    static async productUpdated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);

        await client.del('products_frontend');
        await client.del('products_backend');
    }

    static async productDeleted(id: string) {
        await connectDBKafka.getRepository(Product).delete(id);

        await client.del('products_frontend');
        await client.del('products_backend');
    }

    static async orderComlpleted(order: any) {
        await client.zIncrBy('rankings', order.ambassador_revenue, order.ambassador_name);
        await connectDBKafka.getRepository(Order).save({
            id: order.id,
            code: order.code,
            user_id: order.user_id,
            total: order.ambassador_revenue
        });
    }
}