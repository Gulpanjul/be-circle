import { Request, Response } from 'express';
import threadService from '../services/thread.service';
import { createThreadSchema } from '../validations/thread.validation';
import { v2 as cloudinary } from 'cloudinary';

class ThreadController {
  async getThreads(req: Request, res: Response) {
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
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async getThreadById(req: Request, res: Response) {
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
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async createThread(req: Request, res: Response) {
    /**
    #swagger.tags = ['Threads']
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            $ref: "#/components/schemas/CreateThreadDTO"
          }
        }
      }
    }
    */
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file?.path || '',
      );
      if (!uploadResult || !uploadResult.secure_url) {
        res.status(500).json({
          message: 'Upload is failed',
          data: null,
        });
        return;
      }

      const body = { ...req.body, images: uploadResult.secure_url };
      const userId = (req as any).user.id;

      const validatedBody = await createThreadSchema.validateAsync(body);
      const thread = await threadService.createThread(userId, validatedBody);

      res.status(200).json({
        message: 'Thread created successfully',
        data: thread,
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

export default new ThreadController();
