// database/sequelizeInstance.ts

import { Sequelize } from 'sequelize';
import pg from 'pg'; // Ref: https://node-postgres.com

let config: any = null;

// local DB setup
if (process.env.POSTGRES_HOST === 'localhost') {
  config = {
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    dialect: 'postgres',
    port: 5433,
    dialectModule: pg,
    benchmark: true,
  };
} else {
  // Production DB Setup
  config = {
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    dialect: 'postgres',
    dialectModule: pg,
    benchmark: true,
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
