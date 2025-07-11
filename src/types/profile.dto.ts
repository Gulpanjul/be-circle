import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullName'];
  bio: Profile['bio'];
  avatarUrl: Profile['avatarUrl'];
};

export type updatedUserProfileDTO = Pick<
  UserProfile,
  'fullName' | 'username' | 'bio' | 'avatarUrl'
>;
