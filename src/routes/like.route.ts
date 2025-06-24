import express from 'express';

import likeController from '../controllers/like.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate, likeController.createLike);
router.delete('/:threadId', authenticate, likeController.deleteLike);

export default router;
