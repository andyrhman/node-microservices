import dotenv from 'dotenv'
dotenv.config();

import { Kafka, Partitioners } from "kafkajs";
import { DataSource } from "typeorm";
import * as fs from 'fs';

export const kafka = new Kafka({
    clientId: 'email-consumer',
    brokers: ['microservices-node-microsevices.k.aivencloud.com:22288'],
    ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync('src/cert/ca.pem', 'utf-8')],
        key: fs.readFileSync('src/cert/service.key', 'utf-8'),
        cert: fs.readFileSync('src/cert/service.cert', 'utf-8')
    },
});

export const connectDBKafka = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
});

export const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
