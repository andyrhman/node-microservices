import { Request, Response } from "express";
import myDataSource from "../config/db.config";
import { Order } from "../entity/order.entity";

export const Orders = async (req: Request, res: Response) => {
    try {
        const orders = await myDataSource.getRepository(Order).find({
            relations: ['order_items']
        });

        res.send(orders.map((order: Order) => {
            return {
                id: order.id,
                name: order.fullName,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items
            };
        }));
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};
