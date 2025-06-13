import Joi from 'joi';
import { CreateReplyDTO } from '../types/reply.dto';

export const createReplySchema = Joi.object<CreateReplyDTO>({
  content: Joi.string().max(280),
});
