import { NextFunction, Request, Response } from 'express';
import streamifier from 'streamifier';

import cloudinary, { extractCloudinaryPublicId } from '../utils/cloudinary';
import profileService from '../services/profile.service';
import { updateProfileSchema } from '../validations/profile.validation';

class ProfileController {
  async getUserProfileById(req: Request, res: Response, next: NextFunction) {
    /**
         #swagger.tags = ['Profile']
         #swagger.security = [{ bearerAuth: [] }]
         */
    const { id } = req.params;
    try {
      const profile = await profileService.getUserProfileById(id);
      if (!profile) {
        res.status(404).json({
          status: 'error',
          code: 404,
          message: 'Profile not found',
          data: [],
        });
        return;
      }
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Profile retrieved successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    /**
         #swagger.tags = ['Profile']
         #swagger.security = [{ bearerAuth: [] }]
         */
    const { id } = (req as any).user;

    try {
      const data = {
        ...req.body,
        avatarUrl: req.body.avatarUrl || '',
      };

      const validatedBody = await updateProfileSchema.validateAsync(data);
      const { username } = validatedBody;

      const existingProfile = await profileService.getUserProfileById(id);
      const oldAvatarUrl = existingProfile?.avatarUrl;

      if (req.file) {
        if (oldAvatarUrl) {
          const publicId = extractCloudinaryPublicId(oldAvatarUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }

        const buffer = req.file.buffer;
        const newAvatarUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              public_id: username,
              overwrite: true,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || '');
            },
          );

          streamifier.createReadStream(buffer).pipe(stream);
        });

        validatedBody.avatarUrl = newAvatarUrl;
      }

      const updatedProfile = await profileService.updateUserProfile(
        id,
        validatedBody,
      );
      const { password, ...safeProfile } = updatedProfile;

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Profile updated successfully',
        data: safeProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
