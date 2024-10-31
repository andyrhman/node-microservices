import { connectDBKafka } from "./config";
import { Product } from "../entity/product.entity";
import { client } from "..";

export class Subscriber {
    static async productCreated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);

        await client.del('products_frontend');
        await client.del('products_backend');
    }

    static async productUpdated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);

        await client.del('products_frontend')
        await client.del('products_backend')
    }

    static async productDeleted(id: string) {
        await connectDBKafka.getRepository(Product).delete(id);

        await client.del('products_frontend')
        await client.del('products_backend')
    }
}