import Joi from 'joi';
import { updatedUserProfileDTO } from '../types/profile.dto';

export const updateProfileSchema = Joi.object<updatedUserProfileDTO>({
  fullName: Joi.string().min(4),
  username: Joi.string().min(4).max(12),
  bio: Joi.string().min(4).max(100),
  avatarUrl: Joi.string().optional(),
});
