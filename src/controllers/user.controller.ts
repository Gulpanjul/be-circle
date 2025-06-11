import { Request, Response } from 'express';
import UserService from '../services/user.services';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user.schema';
import userServices from '../services/user.services';

class UserController {
  async getUsers(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     */
    try {
      const users = await UserService.getUsers();
      res.status(200).json({
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async getUserById(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     */
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({
          message: 'Id is required',
          data: null,
        });
        return;
      }

      const user = await UserService.getUserById(id);
      res.status(200).json({
        message: 'Users retrieved successfully',
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async getUserByEmail(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     */
    const { email } = req.params;
    if (!email) {
      res.status(400).json({
        message: 'Email is required',
        data: null,
      });
      return;
    }
    try {
      const user = await userServices.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          message: 'User not found',
          data: null,
        });
        return;
      }

      res.status(200).json({
        message: 'Users retrieved successfully',
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async createUser(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     */
    const body = req.body;
    try {
      const validatedBody = await createUserSchema.validateAsync(body);
      const user = await UserService.createUser(validatedBody);

      res.status(201).json({
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async updateUserById(req: Request, res: Response) {
    /**
     #swagger.tags =['User']
     */
    const { id } = req.params;
    const body = req.body;
    try {
      const user = await UserService.getUpdateUserById(id);

      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      const { email, username } = await updateUserSchema.validateAsync(body);

      if (email != '') {
        user.email = email;
      }

      if (username != '') {
        user.username = username;
      }

      const updatedUser = await userServices.updateUserById(id, user);

      res.status(200).json({
        message: 'Users updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async deleteUserById(req: Request, res: Response) {
    /**
      #swagger.tags =['User']
     */
    const { id } = req.params;
    try {
      const user = await userServices.deleteUserById(id);
      res.status(200).json({
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
}

export default new UserController();
