import { Request, Response, NextFunction } from 'express';

import UserService from '../services/user.service';
import userServices from '../services/user.service';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/user.validation';

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    try {
      const users = await UserService.getUsers();

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersSearch(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const currentUser = (req as any).user;
    const q = req.query.q as string;
    try {
      if (!q.trim()) {
        res.status(400).json({
          status: 'error',
          code: 400,
          message: 'no data',
          data: [],
        });
        return;
      }

      const users = await UserService.getUsersSearch(q, currentUser.id);

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSuggestedUsers(req: Request, res: Response, next: NextFunction) {
    /**
     * #swagger.tags = ['Users']
     */
    const currentUser = (req as any).user;

    try {
      const users = await UserService.getSuggestedUsers(currentUser.id, 5);

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Suggested users fetched',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Id is required',
          data: [],
        });
        return;
      }

      const user = await UserService.getUserById(id);

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const { email } = req.params;
    if (!email) {
      res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Email is required',
        data: [],
      });
      return;
    }
    try {
      const user = await userServices.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found',
          data: [],
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const { username } = req.params;
    const currentUser = (req as any).user;
    const currentUserId = currentUser?.id;
    try {
      const user = await userServices.getUserByUsername(
        username,
        currentUserId,
      );

      if (!user) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found',
          data: [],
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
  async createUser(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const body = req.body;
    try {
      const validatedBody = await createUserSchema.validateAsync(body);
      const user = await UserService.createUser(validatedBody);

      const { password, ...safeUser } = user;

      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'User created successfully',
        data: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUserById(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
     */
    const { id } = req.params;
    const body = req.body;
    try {
      const user = await UserService.getUpdateUserById(id);

      if (!user) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found',
          data: [],
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

      const { password, ...safeUser } = updatedUser;

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Users updated successfully',
        data: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Users']
    */
    const { id } = req.params;
    try {
      await userServices.deleteUserById(id);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
