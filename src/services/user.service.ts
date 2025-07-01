import { prisma } from '../prisma/client';
import { TCreateUserDTO, TUpdateUserDTO } from '../types/user.dto';

class UserService {
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }
  async getUsersSearch(q?: string) {
    if (q) {
      return await prisma.user.findMany({
        include: {
          profile: true,
        },
        where: {
          OR: [{ username: { contains: q } }],
        },
      });
    }

    return await prisma.user.findMany({
      include: { profile: true },
    });
  }
  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: { id },
      include: {
        profile: true,
      },
    });
  }
  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }
  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      include: { profile: true, followers: true, followings: true },
    });
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
