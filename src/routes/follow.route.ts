import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import followController from '../controllers/follow.controller';

const router = express.Router();

router.get('/followers', authenticate, followController.getFollowers);
router.get('/followings', authenticate, followController.getFollowings);
router.post('/', authenticate, followController.createFollow);
router.delete('/:id', authenticate, followController.deleteFollowById);
router.delete(
  '/followed/:id',
  authenticate,
  followController.deleteFollowByFollowedId,
);

export default router;
