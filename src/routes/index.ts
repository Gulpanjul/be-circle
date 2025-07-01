import express from 'express';

import { rateLimit } from '../middlewares/rate-limiter.middleware';

import authRouter from './auth.route';
import likeRouter from './like.route';
import replyRouter from './reply.routes';
import threadRouter from './thread.route';
import userRouter from './user.route';
import followRouter from './follow.route';
import profileRouter from './profile.route';

const router = express.Router();

router.use('/auth', rateLimit('auth'), authRouter);
router.use('/users', rateLimit('user'), userRouter);
router.use('/threads', rateLimit('thread'), threadRouter);
router.use('/likes', rateLimit('like'), likeRouter);
router.use('/replies', rateLimit('reply'), replyRouter);
router.use('/follow', rateLimit('follow'), followRouter);
router.use('/profile', rateLimit('profile'), profileRouter);

export default router;
