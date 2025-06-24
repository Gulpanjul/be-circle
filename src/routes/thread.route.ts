import express from 'express';

import threadController from '../controllers/thread.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { uploadImage } from '../utils/multer';

const router = express.Router();

router.get('/', threadController.getThreads);
router.get('/:id', threadController.getThreadById);
router.post(
  '/',
  authenticate,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
