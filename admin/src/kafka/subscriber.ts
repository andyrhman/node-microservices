import { connectDBKafka } from "./config";
import { Link } from "../entity/link.entity";

export class Subscriber {
    static async linkCreated(link: Link) {
        await connectDBKafka.getRepository(Link).save(link);
    }

}