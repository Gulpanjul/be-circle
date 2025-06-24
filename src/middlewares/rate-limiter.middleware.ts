import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from 'ioredis';

const client = new RedisClient();

export const likeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: 'Too many request, please try again later',
  store: new RedisStore({
    sendCommand: (...args: [string, ...string[]]) =>
      client.call(...args) as unknown as Promise<any>,
  }),
});

export const threadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  message: 'Too many request, please try again later',
});
