import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export function authCheck(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] || "";
  const jwtSecret = process.env.JWT || "";
  const user = Jwt.verify(token, jwtSecret);

  if (!user) {
    res.status(401).json({
      message: "Unauthorized!",
      data: null,
    });
    return;
  }

  (req as any).user = user;
  next();
}
