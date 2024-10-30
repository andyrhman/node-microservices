import { Request, Response } from "express";
import { client } from "..";

export const Rankings = async (req: Request, res: Response) => {
    try {
        const result: string[] = await client.sendCommand(['ZREVRANGEBYSCORE', 'rankings', '+inf', '-inf', 'WITHSCORES']);

        const rankings = {};
        for (let i = 0; i < result.length; i += 2) {
            const name = result[i];
            const score = parseInt(result[i + 1]);
            rankings[name] = score;
        }

        res.send(rankings);

        /*
        * BUG VERSION
        ?    let name;
        
        ?    res.send(result.reduce((o, r) => {
        ?        if (isNaN(parseInt(r))) {
        ?            name = r;
        ?            return o;
        ?        } else {
        ?            return {
        ?                ...o,
        ?                [name]: parseInt(r)
        ?            };
        ?        }
        ?    }, {}));
        
        */
    } catch (error) {
        console.error(error);
        return res.status(400).send({ message: "Invalid Request" });
    }
};