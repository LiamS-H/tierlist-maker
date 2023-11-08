import express, { Express, Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { resetDB } from './config/db';

import tierlistRoute from './routes/tierlistRoute';

resetDB()
dotenv.config();

const app: Application = express();
const PORT: Number | string = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
  
app.get('/', (req: Request, res: Response) => {
    res.send('API is running');
});

app.use('/api/tierlist', tierlistRoute);



app.listen(PORT, () => {
    console.log(`tierlist-maker backend starting on port ${PORT}`)
});