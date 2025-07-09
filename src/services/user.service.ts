import { prisma } from '../prisma/client';
import { TCreateUserDTO, TUpdateUserDTO } from '../types/user.dto';

class UserService {
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
      omit: {
        password: true, // Exclude password from the response
      },
    });
  }
  async getUsersSearch(q: string, currentUserId: string) {
    if (q) {
      return await prisma.user.findMany({
        include: {
          profile: true,
        },
        where: {
          username: { contains: q },
          id: { not: currentUserId },
        },
      });
    }

    return await prisma.user.findMany({
      include: { profile: true },
    });
  }
  async getSuggestedUsers(currentUserId: string, limit: number) {
    const users = await prisma.user.findMany({
      take: limit,
      where: {
        id: { not: currentUserId },
      },
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!users || users.length === 0) return [];

    // Ambil semua ID user yang ingin dicek apakah di-follow
    const userIds = users.map((u) => u.id);

    // Ambil daftar yang sudah di-follow oleh current user
    const follows = await prisma.follow.findMany({
      where: {
        followedId: { in: userIds },
        followingId: currentUserId,
      },
      select: {
        followedId: true,
      },
    });

    const followedIds = new Set(follows.map((f) => f.followedId));

    // Hapus password & tambahkan isFollowed
    return users.map(({ password, ...user }) => ({
      ...user,
      isFollowed: followedIds.has(user.id),
    }));
  }

  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
      omit: {
        password: true, // Exclude password from the response
      },
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }
  async getUserByUsername(username: string, currentUserId: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });

    if (!user) return null;

    const isFollowed = await prisma.follow.findFirst({
      where: {
        followedId: user.id,
        followingId: currentUserId,
      },
      select: { id: true },
    });

    return {
      ...user,
      followersCount: user._count.followers,
      followingsCount: user._count.followings,
      isFollowed: !!isFollowed,
    };
  }

  async getUpdateUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      select: {
        email: true,
        username: true,
        password: true,
      },
    });
  }
  async createUser(data: TCreateUserDTO) {
    const { fullName, ...userData } = data;

    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: { fullName },
        },
      },
    });
  }
  async deleteUserById(id: string) {
    await prisma.profile.delete({
      where: { userId: id },
    });
    return await prisma.user.delete({
      where: { id },
    });
  }
  async updateUserById(id: string, data: TUpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
}

export default new UserService();
