import { TCreateUserDTO, TUpdateUserDTO } from '../types/user.dto';
import { prisma } from '../prisma/client';

class UserService {
  async getUsers(search?: string) {
    if (search) {
      return await prisma.user.findMany({
        include: {
          profile: true,
        },
        where: {
          OR: [{ username: { contains: search } }],
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
