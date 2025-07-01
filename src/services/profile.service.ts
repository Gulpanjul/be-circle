import { prisma } from '../prisma/client';
import { updatedUserProfileDTO } from '../types/profile.dto';

class ProfileService {
  async getUserProfileById(id: string) {
    return await prisma.profile.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }
  async updateUserProfile(id: string, data: updatedUserProfileDTO) {
    const { fullName, username, bio, avatarUrl } = data;

    return await prisma.user.update({
      where: { id },
      data: {
        username,
        profile: {
          update: {
            fullName,
            bio,
            avatarUrl,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }
}

export default new ProfileService();
