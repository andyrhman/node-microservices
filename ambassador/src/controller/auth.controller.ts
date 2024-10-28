import { Response, Request } from "express";
import { User } from "../entity/user.entity";
import logger from "../config/logger";
import myDataSource from "../config/db.config";
import * as argon2 from 'argon2';
import { sign, verify } from "jsonwebtoken";
import { Order } from "../entity/order.entity";
import axios from "axios";

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const response = await axios.post('http://172.17.0.1:8001/api/register', {
            ...body,
            is_ambassador: req.path === '/api/ambassador/register'
        });

        res.send(response.data);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const { data } = await axios.post('http://172.17.0.1:8001/api/login', {
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
        // res.clearCookie('user_session');
        const jwt = req.cookies["user_session"];

        await axios.post('http://172.17.0.1:8001/api/logout', {}, {
            headers: {
                'Cookie': `user_session=${jwt}`
            }
        });

        res.status(204).send(null);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const UpdateInfo = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const user = req["user"];

        const repository = myDataSource.getRepository(User);

        const existingUser = await repository.findOne({ where: { id: user.id } });

        if (!existingUser) {
            return res.status(400).send({ message: 'Invalid Request' });
        }

        if (body.fullname) {
            existingUser.fullName = body.fullname;
        }

        if (body.email && body.email !== existingUser.email) {
            const existingUserByEmail = await repository.findOne({ where: { email: body.email } });
            if (existingUserByEmail) {
                return res.status(400).send({ message: 'Email already exists' });
            }
            existingUser.email = body.email;
        }

        if (body.username && body.username !== existingUser.username) {
            const existingUserByUsername = await repository.findOne({ where: { username: body.username } });
            if (existingUserByUsername) {
                return res.status(400).send({ message: 'Username already exists' });
            }
            existingUser.username = body.username;
        }

        await repository.update(user.id, req.body);

        res.status(202).send(existingUser);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const UpdatePassword = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

        if (await req.body.password !== req.body.confirm_password) {
            return res.status(400).send({ message: "Password not match" });
        }

        await myDataSource.getRepository(User).update(user.id, {
            password: await argon2.hash(req.body.password)
        });

        res.status(202).send(user);
    } catch (error) {
        logger.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};