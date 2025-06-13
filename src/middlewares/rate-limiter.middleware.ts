import rateLimit from 'express-rate-limit';

const likeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: 'Too many request, please try again later',
});

const threadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  message: 'Too many request, please try again later',
});

export default { likeLimiter, threadLimiter };
