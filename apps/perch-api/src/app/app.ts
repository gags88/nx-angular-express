// apps/perch-api/src/app/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// All API routes mounted under `/api`
app.use('/api', router);

export default app;
