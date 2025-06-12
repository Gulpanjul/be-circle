import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  message: 'Too many request, please try again later',
});

export default limiter;
