import { Request, Response } from 'express';
import authServices from '../services/auth.services';
import userServices from '../services/user.services';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth.schema';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/auth.dto';
import { forgotToken, signToken } from '../utils/jwt';
import { FRONTEND_BASE_URL, NODEMAILER_USER_EMAIL } from '../utils/env';
import { transporter } from '../libs/nodemailer';

class AuthController {
  async login(req: Request, res: Response) {
    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginDTO"
          }
        }
      }
    }
    */
    const body = req.body;
    try {
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userServices.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          message: 'Email is wrong',
          data: null,
        });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        res.status(404).json({
          message: 'Password is wrong!',
          data: null,
        });
        return;
      }

      const token = signToken(user.id);

      res.status(200).json({
        message: 'Login success',
        data: token,
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
    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RegisterDTO"
          }
        }
      }
    }
    */
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
        message: 'Register Success',
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
  async check(req: Request, res: Response) {
    /**
     * #swagger.tags =['Auth']
     */
    const payload = (req as any).user;
    try {
      const user = await userServices.getUserById(payload.id);
      res.status(200).json({
        message: 'Authentication successful',
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
  async forgotPassword(req: Request, res: Response) {
    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ForgotPasswordDTO"
          }
        }
      }
    }
    */

    const body = req.body;
    try {
      const { email } = await forgotPasswordSchema.validateAsync(body);

      const token = forgotToken(email);

      const fronendUrl = FRONTEND_BASE_URL;
      const resetPasswordLink = `${fronendUrl}/reset-password?token=${token}`;

      const mailOptions = {
        from: NODEMAILER_USER_EMAIL,
        to: email,
        subject: 'Circle | Forgot Password',
        html: `
        <h1>This is link for reset password:</h1>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message: 'Forgot password link sent!',
        data: email,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  }
  async resetPassword(req: Request, res: Response) {
    /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ResetPasswordDTO"
          }
        }
      }
    }
    */
    const payload = (req as any).user;
    const body = req.body;

    if (!payload?.email) {
      res.status(400).json({
        message: 'Invalid token payload',
        data: null,
      });
      return;
    }
    try {
      const { oldPassword, newPassword } =
        await resetPasswordSchema.validateAsync(body);

      if (oldPassword === newPassword) {
        res.status(400).json({
          message: 'Password cannot be the same as previous',
        });
        return;
      }

      const user = await userServices.getUserByEmail(payload.email);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
          data: null,
        });
        return;
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password,
      );

      if (!isOldPasswordCorrect) {
        res.status(400).json({
          message: 'Old password is not correct!',
          data: null,
        });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updatedUserPassword = await authServices.resetPassword(
        user.email,
        hashedNewPassword,
      );
      res.send(updatedUserPassword);
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
