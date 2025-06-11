import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/email/:email', UserController.getUserByEmail);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.patch('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

export default router;
