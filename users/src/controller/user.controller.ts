import { Request, Response } from "express";
import { User } from "../entity/user.entity";
import myDataSource from "../config/db.config";

export const Users = async (req: Request, res: Response) => {
    try {
        res.send(await myDataSource.getRepository(User).find());
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const GetUser = async (req: Request, res: Response) => {
    try {
        res.send(await myDataSource.getRepository(User).findOne({ where: { id: req.params.id } }));
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};