import { Request, Response, NextFunction } from 'express';
import { followedSchema } from '../validations/follow.validation';
import followService from '../services/follow.service';

class FollowController {
  async createFollow(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const followingId = (req as any).user.id;
    try {
      const { followedId } = await followedSchema.validateAsync(body);
      const follow = await followService.getFollowsById(
        followingId,
        followedId,
      );

      if (follow) {
        res.status(400).json({
          message: 'You cannot follow twice!',
        });
        return;
      }

      await followService.createFollow(followingId, followedId);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Follow success!',
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  async getFollowers(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const currentUserId = userId;
    try {
      const followers = await followService.getFollowers(userId, currentUserId);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Followers retrieved successfully',
        data: followers,
      });
    } catch (error) {
      next(error);
    }
  }
  async getFollowings(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const currentUserId = userId;
    try {
      const followings = await followService.getFollowings(
        userId,
        currentUserId,
      );
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Followings retrieved successfully',
        data: followings,
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteFollowById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const followingId = (req as any).user.id;
    try {
      const follow = await followService.getFollowsById(followingId, id);

      if (!follow || follow.followingId !== followingId) {
        res.status(400).json({
          message: 'Follow not found',
        });
        return;
      }

      await followService.deleteFollowById(follow.id);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Follow deleted successfully',
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  async deleteFollowByFollowedId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { followedId } = req.params;
    if (!followedId) {
      res.status(400).json({
        message: 'FollowedId is required',
      });
    }
    try {
      await followService.deleteFollowByFollowedId(followedId);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Unfollow successful',
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FollowController();
