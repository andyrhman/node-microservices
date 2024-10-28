require('dotenv').config();
import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";

const seederSource = new DataSource({
    type: "postgres",
    host: '172.17.0.1',
    port: parseInt('54323'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador',
    entities: [
        User
    ],
    logging: false,
    synchronize: true
});

export default seederSource;