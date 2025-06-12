import { Request, Response, NextFunction } from 'express';
import threadService from '../services/thread.service';
import { createThreadSchema } from '../validations/thread.validation';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

class ThreadController {
  async getThreads(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags =['Threads']
    */
    try {
      const threads = await threadService.getThreads();
      res.status(200).json({
        message: 'Threads retrieved successfully',
        data: threads,
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
    const filePath = req.file?.path;

    try {
      const userId = (req as any).user.id;
      const validatedBody = await createThreadSchema.validateAsync(req.body);

      const uploadResult = await cloudinary.uploader.upload(
        req.file?.path || '',
        { folder: 'threads' },
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
      next(error);
    }
  }
}

export default new ThreadController();
