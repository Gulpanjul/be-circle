import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextFunction, Request, Response } from 'express';

export function rateLimit(identifier: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    // const redis = Redis.fromEnv();

    // async function testRedisConnection() {
    //   try {
    //     const response = await redis.ping();
    //     console.log('✅ Redis connected:', response);
    //   } catch (err) {
    //     console.error('❌ Redis connection failed:', err);
    //   }
    // }

    // testRedisConnection();

    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '10 s'),
    });

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      res.status(429).json({
        status: 'error',
        code: 429,
        message: 'Too many requests',
        data: [],
      });
      return;
    }
    next();
  };
}
