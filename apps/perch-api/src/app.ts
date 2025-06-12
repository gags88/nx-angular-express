import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './app/routes';
import * as middleware from './middlewares';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

export default app;
