import express from 'express';

import UserController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/search', authenticate, UserController.getUsersSearch);
router.get('/suggested', authenticate, UserController.getSuggestedUsers);
router.get('/:id', UserController.getUserById);
router.get('/email/:email', UserController.getUserByEmail);
router.get('/username/:username', UserController.getUserByUsername);
router.post('/', UserController.createUser);
router.patch('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

export default router;
