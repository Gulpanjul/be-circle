import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../utils/env';

export function initCloudinary(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  next();
}
