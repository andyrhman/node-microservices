import { Response, Request } from "express";
import logger from "../config/logger";
import myDataSource from "../config/db.config";
import { Order } from "../entity/order.entity";
import axios from "axios";
import { UserService } from "../service/user.service";

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const user = await UserService.post('register', {
            ...body,
            is_ambassador: req.path === '/api/ambassador/register'
        });

        res.send(user);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const data = await UserService.post('login', {
            ...body,
            scope: req.path === '/api/admin/login' ? 'admin' : 'ambassador'

        });

        res.cookie('user_session', data['jwt'], {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).send({ message: "Successfully logged in!" });
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};
 
export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

        if (req.path === '/api/admin/user') {
            return res.send(user);
        }

        /*
            * This code has different implementation as in nestjs ambassador
            * in nestjs we count directly the ambassador revenue in the entity like this
            ?   get revenue(): number {
            ?        return this.orders.filter(o => o.complete).reduce((s, o) => s + o.ambassador_revenue, 0)
            ?   }

            * but for this project we count the revenue inside the controller
            * use this alternative if you don't want to use the nestjs one
        */
        const orders = await myDataSource.getRepository(Order).find({
            where: {
                user_id: user['id'],
                complete: true
            },
            relations: ['order_items']
        });

        user['revenue'] = orders.reduce((s, o) => s + o.ambassador_revenue, 0);

        res.send(user);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const Logout = async (req: Request, res: Response) => {
    try {
        await UserService.post('logout', {}, req.cookies["user_session"]);

        res.clearCookie('user_session');

        res.status(204).send(null);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const UpdateInfo = async (req: Request, res: Response) => {
    try {
        res.status(202).send(await UserService.put('users/info', req.body, req.cookies["user_session"])
        );
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const UpdatePassword = async (req: Request, res: Response) => {
    try {
        res.status(202).send(await UserService.put('users/password', req.body, req.cookies["user_session"]));
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};