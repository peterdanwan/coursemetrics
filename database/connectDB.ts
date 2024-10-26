// database/connectDB.ts
import { sequelizeInstance } from './sequelizeInstance';
import { setupAssociations } from './models';
import { logger } from '@/utils';
import { seedDB } from './seedDB';

const connectDB = (() => {
  let isInitialized = false;

  return async () => {
    const log = logger.child({ module: 'database/connectDB.ts' });

    if (isInitialized) {
      log.info('Database already initialized. Skipping sync and seed.');
      return;
    }

    try {
      // Connect the app with the database
      log.info('Attempting to establish database connection...');
      await sequelizeInstance.authenticate();
      log.info('Database connection successfully established');

      // Setup associations before seeding the models
      log.info('Setting up model associations...');
      setupAssociations();
      log.info('Model associations established successfully');

      // Sync the database tables based on the models
      log.info('Synchronizing database tables...');
      await sequelizeInstance.sync({ force: false });
      log.info('Database tables synchronized successfully');

      // Populate data
      // log.info('Beginning database seeding process...');
      await seedDB();
      // log.info('Database seeded successfully');

      // Ensures that the database connection isn't re-initialized
      isInitialized = true;
      log.info('Database initialization complete');
    } catch (error: any) {
      log.error('Unable to connect to the database', {
        error: error.message,
      });
      throw new Error(`Database connection failed: ${error.message}`);
    }
  };
})();

export { connectDB };
