import { Kafka, Partitioners  } from "kafkajs";
import * as fs from 'fs';

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT,
    brokers: [process.env.KAFKA_BROKERS],
    ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync('src/cert/ca.pem', 'utf-8')],
        key: fs.readFileSync('src/cert/service.key', 'utf-8'),
        cert: fs.readFileSync('src/cert/service.cert', 'utf-8')
    },
});

export const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
