import Joi from 'joi';

import { CreateLikeDTO, DeleteLikeDTO } from '../types/like.dto';

export const createLikeSchema = Joi.object<CreateLikeDTO>({
  threadId: Joi.string().uuid(),
});

export const deleteLikeSchema = Joi.object<DeleteLikeDTO>({
  threadId: Joi.string().uuid(),
});
