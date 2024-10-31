import { Request, Response } from "express";
import { Link } from "../entity/link.entity";
import myDataSource from "../config/db.config";
import { producer } from "../kafka/config";

export const CreateLink = async (req: Request, res: Response) => {
    try {
        const user = req['user'];
        const link = await myDataSource.getRepository(Link).save({
            user_id: user['id'],
            code: Math.random().toString(36).substring(6),
            products: req.body.products.map((id: any) => {
                return {
                    id: id
                };
            })
        });

        await producer.send({ 
            topic: 'admin_topic',
            messages: [
                {
                    key: "linkCreated",
                    value: JSON.stringify(link)
                }
            ]
        });

        res.send(link);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const Stats = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

        const links: Link[] = await myDataSource.getRepository(Link).find({
            where: { user_id: user['id'] },
            relations: ['orders']
        });

        res.send(links.map(link => {
            /*
                * This code has different implementation as in nestjs ambassador
                * in nestjs we count directly the ambassador revenue in the entity like this
                ?   get revenue(): number {
                ?        return this.orders.filter(o => o.complete).reduce((s, o) => s + o.ambassador_revenue, 0)
                ?   }
    
                * but for this project we count the revenue inside the controller
                * use this alternative if you don't want to use the nestjs one
            */
            return {
                code: link.code,
                count: link.orders.length,
                revenue: link.orders.reduce((s, o) => s + o.total, 0)
            };
        }));
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};
