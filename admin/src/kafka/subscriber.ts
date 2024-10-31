import { connectDBKafka } from "./config";
import { Link } from "../entity/link.entity";
import { Order } from "../entity/order.entity";

export class Subscriber {
    static async linkCreated(link: Link) {
        await connectDBKafka.getRepository(Link).save(link);
    }

    static async orderComlpleted(order: Order) {
        await connectDBKafka.getRepository(Order).save(order);
    }
}