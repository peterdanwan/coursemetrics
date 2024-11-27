// database/sequelizeInstance.ts

import { Sequelize } from 'sequelize';
import pg from 'pg'; // Ref: https://node-postgres.com

let config: any = null;

// local DB setup
if (process.env.BUILD_ENV === 'dev') {
  config = {
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'coursemetricsDB',
    dialect: 'postgres',
    port: 5433,
    dialectModule: pg,
    benchmark: true,
    logging: false,
  };
} else if (process.env.BUILD_ENV === 'prod') {
  // Production DB Setup
  config = {
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    dialect: 'postgres',
    dialectModule: pg,
    benchmark: true,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
}

// Production DB Setup
const sequelizeInstance = new Sequelize(config);

export { sequelizeInstance };
