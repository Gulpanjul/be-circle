import express from 'express';
import threadController from '../controllers/thread.controller';
import { uploadImage } from '../utils/multer';
import { authenticate } from '../middlewares/auth.middleware';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import { threadLimiter } from '../middlewares/rate-limiter.middleware';

const router = express.Router();

router.get('/', threadController.getThreads);
router.get('/:id', threadController.getThreadById);
router.post(
  '/',
  threadLimiter,
  authenticate,
  initCloudinary,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
