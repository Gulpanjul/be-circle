import { Request, Response } from "express";
import authServices from "../services/auth.services";
import userServices from "../services/user.services";
import { loginSchema, registerSchema } from "../utils/schemas/auth.schema";
import bcrypt from "bcrypt";
import { RegisterDTO } from "../dtos/auth.dto";

class AuthController {
  async login(req: Request, res: Response) {
    const body = req.body;
    try {
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userServices.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          message: "Email/password is wrong",
          data: null,
        });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        res.status(404).json({
          message: "Email/password is wrong!",
          data: null,
        });
        return;
      }

      res.status(200).json({
        message: "Login success",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async register(req: Request, res: Response) {
    const body = req.body;
    try {
      const validatedBody = await registerSchema.validateAsync(body);
      const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

      const registerBody: RegisterDTO = {
        ...validatedBody,
        password: hashedPassword,
      };

      const user = await authServices.register(registerBody);

      res.status(200).json({
        message: "Register Success",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
}

export default new AuthController();
