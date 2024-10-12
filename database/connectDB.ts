// database/connectDB.ts
import { sequelizeInstance } from './sequelizeInstance';
import { logger } from '@/utils';
import { seedDB } from './seedDB';

let isInitialized = false;

const connectDB = async () => {
  const log = logger.child({ module: 'database/connectDB.ts' });

  if (isInitialized) {
    log.info('Database already initialized. Skipping sync and seed.');
    return;
  }

  try {
    log.info('Initializing database connection...');

    await sequelizeInstance.authenticate();
    log.info('Sequelize connected successfully.');

    if (!isInitialized) {
      // This will create the TABLES based on the MODELS that were created
      await sequelizeInstance.sync({ force: false });
      log.info('Database tables synchronized successfully.');

      // Populate data
      await seedDB();
      log.info('Database seeded successfully.');

      isInitialized = true;
    }
  } catch (error: any) {
    log.error('Unable to connect to the database', {
      error: error.message,
    });
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

export { connectDB };
