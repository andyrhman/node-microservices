import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';
import myDataSource from './config/db.config';
import { ValidationMiddleware } from './middleware/validation.middleware';
import { producer } from './kafka/config';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(ValidationMiddleware);
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://localhost:5000']
}));

myDataSource.initialize().then(async () => {
    await producer.connect();
    
    routes(app);

    console.log("🗃️ Database has been initialized!");
    app.listen(8000, () => {
        console.log('👍 Server listening on port 8000');
    });
}).catch((err) => {
    console.error(err);
});