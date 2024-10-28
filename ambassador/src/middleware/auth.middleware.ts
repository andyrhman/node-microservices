import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import myDataSource from "../config/db.config";
import { User } from "../entity/user.entity";
import logger from "../config/logger";
import axios from "axios";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies["user_session"];

        const { data } = await axios.get('http://172.17.0.1:8001/api/user', {
            headers: {
                'Cookie': `user_session=${jwt}`
            }
        });

        req["user"] = data; 
        next();
    } catch (error) {
        return res.status(400).send({ message: "Invalid Request" });
    }
};