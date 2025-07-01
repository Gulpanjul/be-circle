import { prisma } from '../prisma/client';

class FollowService {
  async getFollowsById(followingId: string, followedId?: string) {
    if (followedId) {
      return await prisma.follow.findFirst({
        where: {
          followingId,
          followedId,
        },
      });
    } else {
      return await prisma.follow.findFirst({
        where: { id: followingId },
      });
    }
  }
  async getFollowers(userId: string, currentUserId: string) {
    const followers = await prisma.follow.findMany({
      where: {
        followedId: userId,
      },
      include: {
        following: true,
      },
    });
    const followings = await prisma.follow.findMany({
      where: {
        followingId: currentUserId,
      },
      select: {
        followedId: true,
      },
    });

    const followingsIds = followings.map((following) => following.followedId);

    return followers.map((follower) => {
      return {
        ...follower,
        isFollowed: followingsIds.includes(follower.following.id),
      };
    });
  }
  async getFollowings(userId: string, currentUserId: string) {
    const followings = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        followed: true,
      },
    });
    const userFollowings = await prisma.follow.findMany({
      where: { followingId: currentUserId },
      select: { followedId: true },
    });
    const followingsIds = followings.map((following) => following.followedId);
    return followings.map((following) => ({
      ...followings,
      isFollowed: followingsIds.includes(following.followed.id),
    }));
  }

  async createFollow(followingId: string, followedId: string) {
    return await prisma.follow.create({
      data: {
        followingId,
        followedId,
      },
    });
  }
  async deleteFollowById(followedId: string) {
    return await prisma.follow.delete({
      where: { id: followedId },
    });
  }
  async deleteFollowByFollowedId(followedId: string) {
    return prisma.follow.delete({
      where: { id: followedId },
    });
  }
}

export default new FollowService();
