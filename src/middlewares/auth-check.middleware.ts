import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/env';

export function authCheck(req: Request, res: Response, next: NextFunction) {
  /** 
  #swagger.security = [{
    "bearerAuth":[]
  }]
  */
  let token = req.headers['authorization'] || '';

  if (token.split(' ').length > 1) {
    token = token.split(' ')[1];
  }

  const jwtSecret = JWT_SECRET;
  const user = Jwt.verify(token, jwtSecret);

  if (!user) {
    res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized!',
      data: null,
    });
    return;
  }

  (req as any).user = user;
  next();
}
