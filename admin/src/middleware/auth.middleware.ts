import { Request, Response } from "express";
import { UserService } from "../service/user.service";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        req["user"] = await UserService.get(`user/admin`, req.cookies["user_session"]);

        next();
    } catch (error) {
        return res.status(401).send({message: "Unauthenticated"});
    }
};