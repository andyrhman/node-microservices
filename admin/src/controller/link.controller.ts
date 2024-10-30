import { Request, Response } from "express";
import { Link } from "../entity/link.entity";
import myDataSource from "../config/db.config";

export const Links = async (req: Request, res: Response) => {
    try {
        const links = await myDataSource.getRepository(Link).find({
            where: { user_id: req.params.id },
            relations: ['orders', 'orders.order_items']
        });

        res.send(links);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};
