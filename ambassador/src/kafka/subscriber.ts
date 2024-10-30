import { connectDBKafka } from "./config";
import { Product } from "../entity/product.entity";

export class Subscriber {
    async productCreated(product: Product) {
        console.log("Product Created");
        await connectDBKafka.getRepository(Product).save(product);
    }

    async productUpdated(product: Product) {
        console.log("Product Updated");
        await connectDBKafka.getRepository(Product).save(product);
    }

    async productDeleted(id: string) {
        console.log("Product Deleted");
        await connectDBKafka.getRepository(Product).delete(id);
    }
}