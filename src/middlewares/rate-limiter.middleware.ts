import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextFunction, Request, Response } from 'express';

export function rateLimit(identifier: string) {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
  });

  return async function (req: Request, res: Response, next: NextFunction) {
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      res.status(429).json({
        message: 'Too many requests',
        data: null,
      });
      return;
    }
    next();
  };
}
