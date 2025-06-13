import express from 'express';
import likeController from '../controllers/like.controller';
import limiter from '../middlewares/rate-limiter.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(limiter.likeLimiter);

router.post('/', authenticate, likeController.createLike);
router.delete('/:threadId', authenticate, likeController.deleteLike);

export default router;
