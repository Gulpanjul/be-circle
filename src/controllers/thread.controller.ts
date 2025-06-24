import e, { Request, Response, NextFunction } from 'express';
import threadService from '../services/thread.service';
import { createThreadSchema } from '../validations/thread.validation';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import likeService from '../services/like.service';
import path from 'path';

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
    try {
      const thread = await threadService.getThreadById(id);

      res.status(200).json({
        message: 'Threads retrieved successfully',
        data: thread,
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
    const filePath: string = req.file?.path || '';
    const folder = 'threads';
    const publicId = `${folder}/${path.parse(filePath).name}`;

    try {
      const userId = (req as any).user.id;
      const validatedBody = await createThreadSchema.validateAsync(req.body);

      const uploadResult = await cloudinary.uploader.upload(
        req.file?.path || '',
        { use_filename: true, unique_filename: false, folder: folder },
      );

      if (!uploadResult || !uploadResult.secure_url) {
        res.status(500).json({
          message: 'Upload is failed',
          data: null,
        });
        return;
      }

      const body = { ...validatedBody, images: uploadResult.secure_url };

      const thread = await threadService.createThread(userId, body);
      if (filePath) fs.unlink(filePath, () => {});
      res.status(200).json({
        message: 'Thread created successfully',
        data: thread,
      });
    } catch (error) {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
      cloudinary.uploader.destroy(publicId);
      console.log(publicId);
      next(error);
    }
  }
}

export default new ThreadController();
