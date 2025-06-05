import { TCreateUserDTO } from "../dtos/user.dto";
import { prisma } from "../prisma/client";

export default {
  async getUsers() {
    return await prisma.user.findMany();
  },
  async createUser(data: TCreateUserDTO) {
    return await prisma.user.create({ data });
  },
};
