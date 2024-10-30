import { EachMessagePayload } from "kafkajs";
import { kafka } from "./config";

const consumer = kafka.consumer({
    groupId: 'monolith-consumer'
});

const run = async () => {
    await consumer.connect();

    console.log('Connected to Kafka!');

    await consumer.subscribe({ topic: 'ambassador_topic' });

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const key = message.message.key.toString();
            const value = JSON.parse(message.message.value.toString());
            console.log(key);
            console.log(value);
        }
    });
};

run().then(console.error);