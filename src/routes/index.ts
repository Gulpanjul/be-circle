import express from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import threadRouter from './thread.route';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/threads', threadRouter);

export default router;
