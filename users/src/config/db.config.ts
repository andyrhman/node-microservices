import { DataSource } from "typeorm";

const myDataSource = new DataSource({
    type: "postgres",
    host: 'users_db',
    port: parseInt('5432'),
    username: 'postgres',
    password: '123123',
    database: 'node_ambassador_users',
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
});

export default myDataSource;