import express from 'express';

import replyController from '../controllers/reply.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/:threadId', authenticate, replyController.getRepliesByThreadId);
router.post('/:threadId', authenticate, replyController.createReply);

export default router;
