import { EachMessagePayload } from "kafkajs";
import { kafka } from "./config";
import { connectDBKafka } from "./config";
import { Subscriber } from "./subscriber";

const consumer = kafka.consumer({
    groupId: 'monolith-consumer'
});

const run = async () => {
    await connectDBKafka.initialize();
    await consumer.connect();

    console.log('Connected to Kafka!');

    await consumer.subscribe({ topic: 'ambassador_topic' });

    const subscriber = new Subscriber();

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const key = message.message.key.toString();
            const value = JSON.parse(message.message.value.toString());

            await subscriber[key](value);
        }
    });
};

run().then(console.error);