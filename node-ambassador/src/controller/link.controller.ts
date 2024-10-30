import { Request, Response } from "express";
import { Link } from "../entity/link.entity";
import logger from "../config/logger";
import myDataSource from "../config/db.config";
import { Order } from "../entity/order.entity";
import { client } from "../index";
import { UserService } from "../service/user.service";

export const GetLink = async (req: Request, res: Response) => {
    try {
        const link = await myDataSource.getRepository(Link).findOne({
            where: { code: req.params.code },
            relations: ['products']
        });

        link['user'] = await UserService.get(`users/${link.user_id}`);

        res.send(link);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};