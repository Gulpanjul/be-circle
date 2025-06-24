import { prisma } from '../prisma/client';
import { RegisterDTO } from '../types/auth.dto';

class AuthService {
  async register(data: RegisterDTO) {
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
  async resetPassword(email: string, hashedNewPassword: string) {
    return await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });
  }
}

export default new AuthService();
