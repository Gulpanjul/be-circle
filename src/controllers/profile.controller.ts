import { NextFunction, Request, Response } from 'express';
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
    const data = { ...req.body, avatarUrl: req.body.avatarUrl || '' };
    try {
      const validatedBody = await updateProfileSchema.validateAsync(data);
      const updatedProfile = await profileService.updateUserProfile(
        id,
        validatedBody,
      );

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
