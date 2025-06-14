import { Request, Response, NextFunction } from 'express';
import authServices from '../services/auth.service';
import userServices from '../services/user.service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validations/auth.validation';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../types/auth.dto';
import { forgotToken, signToken } from '../utils/jwt';
import { FRONTEND_BASE_URL, NODEMAILER_USER_EMAIL } from '../utils/env';
import { transporter } from '../libs/nodemailer';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Auth']
    #swagger.description = 'Register user with fullname, email, username and password'
    #swagger.consumes = ['application/json']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string',
                example: 'admin'
              },
              email: {
                type: 'string',
                example: 'admin@mail.com'
              },
              username: {
                type: 'string',
                example: 'Admin'
              },
              password: {
                type: 'string',
                example: 'admin1234'
              }
            },
            required: ['fullName', 'email', 'username', 'password']
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
        data: { ...user },
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    /**
  #swagger.tags = ['Auth']
  #swagger.description = 'Login user with email and password'
  #swagger.consumes = ['application/json']
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'admin@mail.com'
            },
            password: {
              type: 'string',
              example: 'admin1234'
            }
          },
          required: ['email', 'password']
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

      const { password: unusedPassword, ...userResponse } = user;

      res.status(200).json({
        message: 'Login success',
        data: userResponse,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
  async check(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Auth']
    #swagger.security = [{ bearerAuth: [] }]
     */
    const payload = (req as any).user;
    try {
      const user = await userServices.getUserById(payload.id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const { password: unusedPassword, ...userResponse } = user;

      res.status(200).json({
        message: 'Authentication successful',
        data: { ...userResponse },
      });
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Auth']
    #swagger.description = 'Send token Forgot-Password to email'
    #swagger.consumes = ['application/json']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                example: 'admin@mail.com'
              },
            },
            required: ['email']
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
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    /**
    #swagger.tags = ['Auth']
    #swagger.description = 'Reset password by using token'
    #swagger.security = [{ bearerReset: [] }]
    #swagger.consumes = ['application/json']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
                example: 'admin1234'
              },
              newPassword: {
                type: 'string',
                example: 'admin1234'
              },
            },
            required: ['oldPassword', 'newPassword']
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
      const { password, ...updatedUserPassword } =
        await authServices.resetPassword(user.email, hashedNewPassword);

      res.status(200).json({
        message: 'Reset password success!',
        data: { ...updatedUserPassword },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
