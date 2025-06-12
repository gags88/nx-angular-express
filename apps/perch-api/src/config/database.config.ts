import { SequelizeOptions } from 'sequelize-typescript';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../config';
import { Task } from '../database/models/task.model';

const databaseConfig: SequelizeOptions = {
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  username: DB_USER,
  password: DB_PASSWORD,
  minifyAliases: true,
  logging: false,
  models: [Task],
};

export = databaseConfig;
