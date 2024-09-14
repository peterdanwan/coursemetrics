// config/database.ts
import mongoose from 'mongoose';

let connected: Boolean = false;

// When you work with the Mongoose object, it's asynchronous as it will return a promise
const connectDB = async (): Promise<void> => {
  // This ensures that only the fields that are specified in our schema will be saved in our database
  mongoose.set('strictQuery', true);

  // If the database is already connected, don't connect again
  if (connected) {
    console.log('MongoDB is already connected...');
    return;
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    connected = true;
    console.log('MongoDB connected.');
  } catch (error) {
    console.log(error);
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
