import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "./env";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

const connect = async () => {
  try {
    await prisma.$connect();
    return Promise.resolve("Database connected!");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default connect;
