import { User } from "@prisma/client";

export type TCreateUserDTO = Pick<User, "email" | "username" | "password">;
