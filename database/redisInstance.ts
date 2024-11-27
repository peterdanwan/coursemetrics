import { createClient } from 'redis'; // https://www.npmjs.com/package/redis

let redisClient;

if (process.env.BUILD_ENV === 'dev') {
  redisClient = createClient({
    socket: {
      host: 'localhost',
      port: 6378,
    },
  });
} else {
  redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });
}

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  throw new Error(`Redis Client Error: ${err.message}`);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export default redisClient;
