import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import myDataSource from "../config/db.config";
import { User } from "../entity/user.entity";
import { Token } from "../entity/token.entity";
import { MoreThanOrEqual } from "typeorm";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies["user_session"];

        const payload: any = verify(jwt, process.env.JWT_SECRET_ACCESS);

        if (!payload) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        const user = await myDataSource.getRepository(User).findOne({ where: { id: payload.id } });

        // ? Check for jwt token stored on DB
        const userToken = await myDataSource.getRepository(Token).findOne({
            where: {
                user_id: user.id,
                expired_at: MoreThanOrEqual(new Date())
            }
        });

        if (!userToken) {
            return res.status(401).send({ message: "Unauthenticated" });
        }

        // ? check if ambassdor by using the ambassador endpoints
        // const is_ambassador = req.path.indexOf('api/ambassador') >= 0;

        // if ((is_ambassador && payload.scope !== 'ambassador') || (!is_ambassador && payload.scope !== 'admin')) {
        //     return res.status(403).send({ message: "Unauthorized" })
        // }

        req["user"] = user;
        next();
    } catch (error) {
        return res.status(400).send({ message: "Invalid Request" });
    }
};