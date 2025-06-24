import express from 'express';

import likeController from '../controllers/like.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { likeLimiter } from '../middlewares/rate-limiter.middleware';

const router = express.Router();

router.use(likeLimiter);

router.post('/', authenticate, likeController.createLike);
router.delete('/:threadId', authenticate, likeController.deleteLike);

export default router;
