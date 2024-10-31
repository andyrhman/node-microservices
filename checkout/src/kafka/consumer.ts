import dotenv from 'dotenv';
dotenv.config();

import { EachMessagePayload } from "kafkajs";
import { kafka } from "./config";
import { connectDBKafka } from "./config";
import { Subscriber } from "./subscriber";
import { KafkaError } from '../entity/kafka-error.entity';

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_CLIENT
});

connectDBKafka.initialize().then(async () => {
    await consumer.connect();

    console.log('Connected to Kafka!');

    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC });

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const key: string = message.message.key?.toString() || "";
            const value = JSON.parse(message.message.value?.toString() || '{}');

            try {
                await Subscriber[key](value);
            } catch (error) {
                await connectDBKafka.getRepository(KafkaError).save({
                    key,
                    value,
                    error: error.message
                });
            } 
        }
    });

}).catch((err) => {
    console.error(err);
});
