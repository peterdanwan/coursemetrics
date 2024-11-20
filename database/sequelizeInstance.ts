// database/sequelizeInstance.ts

import { Sequelize } from 'sequelize';
import pg from 'pg'; // Ref: https://node-postgres.com

// Local DB Setup
// const sequelizeInstance = new Sequelize({
//   host: process.env.POSTGRES_HOST,
//   username: process.env.POSTGRES_USERNAME,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DATABASE,
//   dialect: 'postgres',
//   port: 5433,
//   dialectModule: pg,
//   benchmark: true,
// });

// Production DB Setup
const sequelizeInstance = new Sequelize({
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
});

export { sequelizeInstance };
