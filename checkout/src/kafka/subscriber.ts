import { connectDBKafka } from "./config";
import { Product } from "../entity/product.entity";
import { Link } from "../entity/link.entity";

export class Subscriber {
    static async productCreated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);
    }

    static async productUpdated(product: Product) {
        await connectDBKafka.getRepository(Product).save(product);
    }

    static async productDeleted(id: string) {
        await connectDBKafka.getRepository(Product).delete(id);
    }

    static async linkCreated(link: Link) {
        await connectDBKafka.getRepository(Link).save(link);
    }
}