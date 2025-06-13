import express from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import threadRouter from './thread.route';
import likeRouter from './like.route';
import replyRouter from './reply.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/threads', threadRouter);
router.use('/likes', likeRouter);
router.use('/replies', replyRouter);

export default router;
