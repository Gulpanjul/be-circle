import Joi from 'joi';
import { FollowedDTO, FollowingsDTO } from '../types/follow.dto';

export const followedSchema = Joi.object<FollowedDTO>({
  followedId: Joi.string().uuid(),
});

export const followingSchema = Joi.object<FollowingsDTO>({
  followingId: Joi.string().uuid(),
});
