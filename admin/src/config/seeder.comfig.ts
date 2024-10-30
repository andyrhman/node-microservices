import dotenv from 'dotenv'
dotenv.config();

import { DataSource } from "typeorm";

const seederSource = new DataSource({
    type: "postgres",
    host: '172.17.0.1', // ? Linux docker internal ip is 172.17.0.1
    port: parseInt('54323'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador',
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
});

export default seederSource;