import myDataSource from "../config/db.config";
import { Request, Response } from "express";
import { Product } from "../entity/product.entity";
import { producer } from "../kafka/config";

export const Products = async (req: Request, res: Response) => {
    try {
        const products = await myDataSource.getRepository(Product).find();

        await producer.send({
            topic: 'ambassador_topic',
            messages: [
                {
                    key: "product_created",
                    value: JSON.stringify(products)
                }
            ]
        });

        res.send({ products });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }

};

export const CreateProduct = async (req: Request, res: Response) => {
    try {
        res.send(await myDataSource.getRepository(Product).save(req.body));
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const GetProduct = async (req: Request, res: Response) => {
    try {
        res.send(await myDataSource.getRepository(Product).findOne({ where: { id: req.params.id } }));
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const UpdateProduct = async (req: Request, res: Response) => {
    try {
        const repository = myDataSource.getRepository(Product);

        await repository.update(req.params.id, req.body);

        const product = await repository.findOne({ where: { id: req.params.id } });

        await producer.send({
            topic: 'ambassador_topic',
            messages: [
                {
                    key: "product_updated",
                    value: JSON.stringify(product)
                }
            ]
        });

        res.status(202).send(product);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};

export const DeleteProduct = async (req: Request, res: Response) => {
    try {
        await myDataSource.getRepository(Product).delete(req.params.id);

        await producer.send({
            topic: 'ambassador_topic',
            messages: [
                {
                    key: "product_deleted",
                    value: req.params.id
                }
            ]
        });

        res.status(204).send(null);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};
