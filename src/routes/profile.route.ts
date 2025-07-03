import { profile } from 'console';
import express from 'express';
import profileController from '../controllers/profile.controller';
import { authenticate } from '../middlewares/auth.middleware';
import cloudinary from '../utils/cloudinary';
import { uploadImage } from '../utils/multer';

const router = express.Router();

router.get('/:id', profileController.getUserProfileById);
router.patch(
  '/:id',
  authenticate,
  uploadImage.single('avatar'),
  profileController.updateUserProfile,
);

export default router;
