import { Response, Request } from "express";
import { plainToClass } from "class-transformer";
import { RegisterDto } from "../validation/dto/register.dto";
import { validate } from "class-validator";
import { formatValidationErrors } from "../utility/validation.utility";
import { User } from "../entity/user.entity";
import { sign, verify } from "jsonwebtoken";
import myDataSource from "../config/db.config";
import * as argon2 from 'argon2';
import { Token } from "../entity/token.entity";

export const Register = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const input = plainToClass(RegisterDto, body);
        const validationErrors = await validate(input);

        if (validationErrors.length > 0) {
            // Use the utility function to format and return the validation errors
            return res.status(400).json(formatValidationErrors(validationErrors));
        }

        const user = await myDataSource.getRepository(User).save({
            fullName: body.fullName,
            username: body.username,
            email: body.email,
            password: await argon2.hash(body.password)
        });

        delete user.password;

        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const repository = myDataSource.getRepository(User);

        let user: User;

        if (body.email) {
            user = await repository.findOne({ where: { email: body.email }, select: ['id', 'password'] });
        } else {
            user = await repository.findOne({ where: { username: body.username }, select: ['id', 'password'] });
        }

        if (!user) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }

        if (!await argon2.verify(user.password, body.password)) {
            return res.status(400).send({ message: "Invalid Credentials" });
        }

        const jwt = sign({
            id: user.id,
            scope: req.body.scope
        }, process.env.JWT_SECRET_ACCESS);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await myDataSource.getRepository(Token).save({
            user_id: user.id,
            token: jwt,
            expired_at: tomorrow
        });

        res.status(200).send({ jwt });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

        if ((req.params.scope == 'ambassador' && req["scope"] !== 'ambassador') || (req.params.scope == 'admin' && req["scope"] !== 'admin')) {
            return res.status(401).send({
                message: 'unauthorized'
            });
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send(error);
    }
};

export const Logout = async (req: Request, res: Response) => {
    try {
        const user = req["user"];

        await myDataSource.getRepository(Token).delete({
            user_id: user['id']
        });

        res.status(204).send(null);
    } catch (error) {
        console.error(error);
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

        // ? Map "fullname" to "fullName" to ensure the backend always sees fullName
        if (body.fullname) {
            body.fullName = body.fullname;
            delete body.fullname;
        }

        if (body.fullName) {
            existingUser.fullName = body.fullName;
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
        console.error(error);
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
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};