// config/database.ts

import { Sequelize } from 'sequelize';
import pg from 'pg'; // Ref: https://node-postgres.com
import { logger } from '@/utils';

let sequelize: Sequelize | null = null;
let connected: boolean = false;
const log = logger.child({ module: 'config/database.ts' });

const connectDB = async (): Promise<Sequelize> => {
  // If already connected, return the existing connection
  if (connected && sequelize) {
    log.info('Sequelize is already connected...');
    return sequelize;
  }

  try {
    // Ref: https://www.youtube.com/watch?v=vFENJpe6eJU
    sequelize = new Sequelize({
      host: 'localhost',
      username: 'postgres',
      password: 'postgres',
      database: 'coursemetricsDB',
      dialect: 'postgres',
      dialectModule: pg,
      benchmark: true,
    });

    await sequelize.authenticate();
    log.info('Sequelize connected successfully.');
    connected = true;

    return sequelize; // Return the Sequelize instance
  } catch (error: any) {
    log.error('Unable to connect to the database', { error: error.message });
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export default connectDB;

/**
 * BACKGROUND:
 * We aren't creating an Express backend or anything like that, we're using Next.js API routes which work in a way that is similar to `serverless functions`.
 * When we hit a `serverless function` or `api route`, it runs the function and will try to connect to the database and do whatever it is we want to do.
 *
 * We can run tests in a Server Component (which our home page is) by returning an asynchronous server component that awaits our call to our database.
 *
 * But, we are designing an app with RESTful endpoints. In other words, we'll have API routes and in those routes (or functions), that's where we'll
 * connect to the database. This is as opposed to connecting directly from a server component.
 */
