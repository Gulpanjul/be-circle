import { Profile, User } from '@prisma/client';

type TUserProfile = User & {
  fullName: Profile['fullName'];
};

export type TCreateUserDTO = Pick<
  TUserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;

export type TUpdateUserDTO = Pick<TUserProfile, 'email' | 'username'>;
