import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import userServices from "../services/user.services";

export default {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userServices.getUsers;
      res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async createUser(req: Request, res: Response) {
    const { email, username, password } = req.body;
    try {
      const user = await userServices.createUser({
        email,
        username,
        password,
      });

      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
