import { Response, Request } from "express";
import { UserService } from "../service/user.service";

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const user = await UserService.post('register', {
            ...body,
            is_ambassador: false
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
            scope: 'admin'

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
        res.send(req["user"]);
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