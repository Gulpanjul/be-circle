import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const PORT: string = process.env.PORT || '3001';

// Jsonwebtoken
export const JWT_SECRET: string = process.env.JWT_SECRET || '';

// Nodemailer
export const NODEMAILER_USER_EMAIL = process.env.NODEMAILER_USER_EMAIL || '';
export const NODEMAILER_USER_PASSWORD: string =
  process.env.NODEMAILER_USER_PASSWORD || '';
export const NODEMAILER_SMTP_SERVICE_NAME: string =
  process.env.NODEMAILER_SMTP_SERVICE_NAME || '';
export const NODEMAILER_SMTP_HOST: string =
  process.env.NODEMAILER_SMTP_HOST || '';
export const NODEMAILER_SMTP_PORT: number =
  Number(process.env.NODEMAILER_SMTP_PORT) || 465;
export const NODEMAILER_SMTP_SECURE: boolean =
  Boolean(process.env.NODEMAILDER_SMTP_SECURE) || false;

// Frontend URL
export const FRONTEND_BASE_URL: string =
  process.env.FRONTEND_BASE_URL || 'http://localhost:3001';

// Cloudinary
export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || '';
