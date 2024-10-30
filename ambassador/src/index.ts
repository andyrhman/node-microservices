import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';
import myDataSource from './config/db.config'
import { ValidationMiddleware } from './middleware/validation.middleware';
import { createClient } from 'redis';
 
const app = express(); 

export const client = createClient({
    url: 'redis://redis:6379'
}); 

app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
}));

myDataSource.initialize().then(async () => {
    await client.connect();

    routes(app);

    console.info("🗃️ Database has been initialized!");
    app.listen(8000, () => {
        console.info('👍 Server listening on port 8000');
    });
}).catch((err) => {
    console.error(err);
});