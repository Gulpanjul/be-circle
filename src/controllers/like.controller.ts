import { NextFunction, Request, Response } from 'express';

import likeService from '../services/like.service';
import {
  createLikeSchema,
  deleteLikeSchema,
} from '../validations/like.validation';

class LikeController {
  async createLike(req: Request, res: Response, next: NextFunction) {
    /**
      #swagger.tags =['Likes']
      #swagger.security = [{ bearerAuth: [] }]
      */
    const body = req.body;
    const userId = (req as any).user.id;
    try {
      const { threadId } = await createLikeSchema.validateAsync(body);
      const like = await likeService.getLikeById(userId, threadId);

      if (like) {
        res.status(400).json({
          status: 'error',
          code: 400,
          message: 'You cannot like thread twice!',
          data: [],
        });
        return;
      }

      const createLike = await likeService.createLike(userId, threadId);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Like success!',
        data: createLike,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteLike(req: Request, res: Response, next: NextFunction) {
    /**
      #swagger.tags = ['Likes']
      #swagger.security = [{ bearerAuth: [] }]
      */
    const params = req.params;
    const userId = (req as any).user.id;
    try {
      const { threadId } = await deleteLikeSchema.validateAsync({
        threadId: params.threadId,
      });

      const like = await likeService.getLikeById(userId, threadId);

      if (!like) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Like not found!',
          data: [],
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'unlike success',
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LikeController();
