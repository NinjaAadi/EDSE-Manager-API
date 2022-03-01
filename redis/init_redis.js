const redis = require("redis");
const logger = require("../logger/logger");

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
});
let isClientStarted = false;
const connectRedis = async () => {
  try {
    if (!isClientStarted) {
      await client.connect();
      isClientStarted = true;
    }

    logger.info(`Redis client connected to port ${process.env.REDIS_HOST}`);
  } catch (error) {
    logger.error(error);
  }
};
connectRedis();
module.exports = client;
