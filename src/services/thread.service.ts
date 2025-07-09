import { prisma } from '../prisma/client';
import { CreateThreadDTO } from '../types/thread.dto';

class ThreadService {
  async getThreads(pagination?: { limit: number; startIndex: number }) {
    return await prisma.thread.findMany({
      include: {
        user: {
          omit: { password: true },
          include: { profile: true },
        },
        likes: true,
        replies: true,
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
      orderBy: { createdAt: 'desc' },
    });
  }
  async getThreadById(id: string) {
    return await prisma.thread.findFirst({
      where: { id },
      include: {
        user: {
          omit: { password: true },
          include: { profile: true },
        },
        likes: true,
        replies: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
  async getThreadsByUserId(userId: string) {
    return await prisma.thread.findMany({
      where: { userId },
      include: {
        user: {
          include: { profile: true },
        },
        likes: true,
        replies: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
  async createThread(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;
    return await prisma.thread.create({
      data: {
        images,
        content,
        userId,
      },
    });
  }
}

export default new ThreadService();
