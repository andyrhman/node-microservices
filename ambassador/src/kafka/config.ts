import { Kafka } from "kafkajs";
import * as fs from 'fs';

const kafka = new Kafka({
    clientId: 'email-customer',
    brokers: ['microservices-node-microsevices.k.aivencloud.com:22288'],
    ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync('src/cert/ca.pem', 'utf-8')],
        key: fs.readFileSync('src/cert/service.key', 'utf-8'),
        cert: fs.readFileSync('src/cert/service.cert', 'utf-8')
    },
});

export const producer = kafka.producer();
