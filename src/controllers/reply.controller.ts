import { Request, Response, NextFunction } from 'express';

import replyService from '../services/reply.service';
import { createReplySchema } from '../validations/reply.validation';

class ReplyController {
  async getRepliesByThreadId(req: Request, res: Response, next: NextFunction) {
    const threadId = req.params.threadId;
    try {
      const replies = await replyService.getRepliesByThreadId(threadId);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'success to fetch data',
        data: replies,
      });
    } catch (error) {
      next(error);
    }
  }
  async createReply(req: Request, res: Response, next: NextFunction) {
    const threadId = req.params.threadId;
    const body = req.body;
    const userId = (req as any).user.id;
    try {
      const validatedBody = await createReplySchema.validateAsync(body);
      const reply = await replyService.createReply(
        userId,
        threadId,
        validatedBody,
      );
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Reply created!',
        data: { ...reply },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ReplyController();
