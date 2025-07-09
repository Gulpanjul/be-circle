import { Request, Response, NextFunction } from 'express';
import streamifier from 'streamifier';

import likeService from '../services/like.service';
import threadService from '../services/thread.service';
import cloudinary from '../utils/cloudinary';
import { createThreadSchema } from '../validations/thread.validation';

class ThreadController {
  async getThreads(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Threads']
    */
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const pagination = {
      page,
      limit,
      startIndex,
    };

    const userId = (req as any).user.id;
    try {
      const threads = await threadService.getThreads(pagination);

      const newThreads = await Promise.all(
        threads.map(async (thread) => {
          const like = await likeService.getLikeById(userId, thread.id);
          const isLiked = like ? true : false;
          const likesCount = thread.likes.length;
          const repliesCount = thread.replies.length;

          return { ...thread, likesCount, repliesCount, isLiked };
        }),
      );
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Threads retrieved successfully',
        data: newThreads,
      });
    } catch (error) {
      next(error);
    }
  }
  async getThreadById(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Threads']
    */
    const { id } = req.params;
    const userId = (req as any).user.id;
    try {
      const thread = await threadService.getThreadById(id);

      if (!thread) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Thread not found!',
          data: [],
        });
        return;
      }
      const like = await likeService.getLikeById(userId, thread.id);
      const isLiked = like ? true : false;
      const likesCount = thread.likes.length;
      const repliesCount = thread.replies.length;

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Threads retrieved successfully',
        data: { ...thread, likesCount, repliesCount, isLiked },
      });
    } catch (error) {
      next(error);
    }
  }
  async getThreadsByUserId(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Threads']
    */
    const { userId } = req.params;
    const authUserId = (req as any).user?.id; // id user yang login (untuk isLiked)

    try {
      const threads = await threadService.getThreadsByUserId(userId);

      if (!threads || threads.length === 0) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Thread not found!',
          data: [],
        });
        return;
      }

      // Tambahkan likesCount, repliesCount, isLiked
      const enrichedThreads = threads.map((thread) => {
        const likesCount = thread.likes.length;
        const repliesCount = thread.replies.length;
        const isLiked = thread.likes.some((like) => like.userId === authUserId);

        return {
          ...thread,
          likesCount,
          repliesCount,
          isLiked,
        };
      });

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Threads retrieved successfully',
        data: enrichedThreads,
      });
    } catch (error) {
      next(error);
    }
  }
  async createThread(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Threads']
    #swagger.security = [{ bearerAuth: [] }]
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['content'] = {
      in: 'formData',
      name: 'content',
      type: 'string',
      required: true,
      example: 'This is my thread content'
    }
    #swagger.parameters['images'] = {
      in: 'formData',
      name: 'images',
      type: 'file',
      description: 'Image file to upload'
    }
    */
    const userId = (req as any).user.id;

    let imageUrl: string | undefined;
    try {
      if (req.file) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'threads',
              use_filename: true,
              unique_filename: false,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result?.secure_url || '');
            },
          );
          if (req.file?.buffer) {
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          }
        });
      }

      const body = {
        ...req.body,
        images: imageUrl,
      };

      const validatedBody = await createThreadSchema.validateAsync(body);
      const thread = await threadService.createThread(userId, validatedBody);

      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Thread created successfully',
        data: thread,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ThreadController();
