import { EachMessagePayload, Kafka } from "kafkajs";
import { createTransport } from "nodemailer";
import * as fs from 'fs';
import * as handlebars from 'handlebars';

const kafka = new Kafka({
    clientId: 'email-customer',
    brokers: ['microservices-node-microsevices.k.aivencloud.com:22288'],
    ssl: {
        rejectUnauthorized: false,
        ca: [fs.readFileSync('cert/ca.pem', 'utf-8')],
        key: fs.readFileSync('cert/service.key', 'utf-8'),
        cert: fs.readFileSync('cert/service.cert', 'utf-8')
    },
});

const consumer = kafka.consumer({
    groupId: 'email-consumer'
});

const transporter = createTransport({
    host: 'host.docker.internal',
    port: 1025
});

const run = async () => {
    await consumer.connect();

    await consumer.subscribe({ topic: 'default' });

    await consumer.run({
        eachMessage: async (message: EachMessagePayload) => {
            const order = JSON.parse(message.message.value.toString());

            const adminSource = fs.readFileSync('src/templates/admin-order.handlebars', 'utf-8').toString();
            const ambassadorSource = fs.readFileSync('src/templates/ambassador-order.handlebars', 'utf-8').toString();
            const adminTemplate = handlebars.compile(adminSource);
            const ambassadorTemplate = handlebars.compile(ambassadorSource);
            const adminReplacement = {
                orderId: order.id,
                orderTotal: `Rp${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(order.total / 1000)}`
            };
            const ambassadorReplacement = {
                ambassadorRevenue: `Rp${new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(order.ambassador_revenue / 1000)}`,
                orderCode: order.code
            };
            const sendToAdmin = adminTemplate(adminReplacement);
            const sendToAmbassador = ambassadorTemplate(ambassadorReplacement);

            const optionsAdmin = {
                from: 'service@mail.com',
                to: 'admin@admin.com',
                subject: "An order has been completed",
                html: sendToAdmin
            };

            const optionsAmbassador = {
                from: 'service@mail.com',
                to: order.ambassador_email,
                subject: "An order has been completed",
                html: sendToAmbassador
            };

            await transporter.sendMail(optionsAdmin);
            await transporter.sendMail(optionsAmbassador);
        }
    });
};

run().then(console.error);


