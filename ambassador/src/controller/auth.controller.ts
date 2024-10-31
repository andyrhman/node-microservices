import { Response, Request } from "express";
import myDataSource from "../config/db.config";
import { Order } from "../entity/order.entity";
import { UserService } from "../service/user.service";

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const user = await UserService.post('register', {
            ...body,
            is_ambassador: true
        });

        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const data = await UserService.post('login', {
            ...body,
            scope: 'ambassador'

        });

        res.cookie('user_session', data['jwt'], {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).send({ message: "Successfully logged in!" });
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

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
                user_id: user['id']
            }
        });

        user['revenue'] = orders.reduce((s, o) => s + o.total, 0);

        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const Logout = async (req: Request, res: Response) => {
    try {
        await UserService.post('logout', {}, req.cookies["user_session"]);

        res.clearCookie('user_session');

        res.status(204).send(null);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const UpdateInfo = async (req: Request, res: Response) => {
    try {
        res.status(202).send(await UserService.put('users/info', req.body, req.cookies["user_session"])
        );
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};

export const UpdatePassword = async (req: Request, res: Response) => {
    try {
        res.status(202).send(await UserService.put('users/password', req.body, req.cookies["user_session"]));
    } catch (error) {
        console.error(error);
        return res.status(400).send(error.data);
    }
};