// database/sequelizeInstance.ts

import { Sequelize } from 'sequelize';
import pg from 'pg'; // Ref: https://node-postgres.com

const sequelizeInstance = new Sequelize({
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'coursemetricsDB',
  dialect: 'postgres',
  port: 5433,
  dialectModule: pg,
  benchmark: true,
});

export { sequelizeInstance };
