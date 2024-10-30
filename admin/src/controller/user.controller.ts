import { Request, Response } from "express";
import { UserService } from "../service/user.service";

export const Ambassadors = async (req: Request, res: Response) => {
    try {
        const users = await UserService.get('users');
        res.send(users.filter(u => u['is_ambassador']));
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};