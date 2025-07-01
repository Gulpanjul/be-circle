import express from 'express';

import threadController from '../controllers/thread.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadImage } from '../utils/multer';

const router = express.Router();

router.get('/', authenticate, threadController.getThreads);
router.get('/:id', authenticate, threadController.getThreadById);
router.get('/users/:id', authenticate, threadController.getThreadsByUserId);
router.post(
  '/',
  authenticate,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
