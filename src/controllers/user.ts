import { Request, Response } from "express";
import { dummyList, Dummy } from "../models/dummy";

export default {
  readUsers: (req: Request, res: Response) => {
    res.json(dummyList);
  },
  createUser: (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const newBlog: Dummy = {
      id: dummyList.length + 1,
      username,
      email,
      password,
    };

    dummyList.push(newBlog);
    res.status(200).json(newBlog);
  },
  updateUser: (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { username, email, password } = req.body;

    const userIndex = dummyList.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.status(404).json({ message: "User is not found" });
      return;
    }

    const updates = Object.fromEntries(
      Object.entries({ username, email, password }).filter(([_, v]) => v)
    );

    dummyList[userIndex] = {
      ...dummyList[userIndex],
      ...updates,
    };
    res.status(200).json({
      message: "Blog has been update",
      data: dummyList[userIndex],
    });
  },
  deleteUser: (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const userIndex = dummyList.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.status(404).json({ message: "User is not found" });
      return;
    }

    dummyList.splice(userIndex, 1);
    res.status(200).json({ message: "User has been delete" });
  },
};
