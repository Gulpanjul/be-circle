import { CreateThreadDTO } from '../types/thread.dto';
import { prisma } from '../prisma/client';

class ThreadService {
  async getThreads() {
    return await prisma.thread.findMany({
      include: {
        user: {
          omit: { password: true },
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  async getThreadById(id: string) {
    return await prisma.thread.findFirst({
      where: { id },
      include: {
        user: {
          include: { profile: true },
        },
        replies: true,
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
