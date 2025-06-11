import nodemailer from 'nodemailer';
import {
  NODEMAILER_SMTP_HOST,
  NODEMAILER_SMTP_PORT,
  NODEMAILER_SMTP_SECURE,
  NODEMAILER_SMTP_SERVICE_NAME,
  NODEMAILER_USER_EMAIL,
  NODEMAILER_USER_PASSWORD,
} from '../utils/env';

const user = NODEMAILER_USER_EMAIL;
const pass = NODEMAILER_USER_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: NODEMAILER_SMTP_SERVICE_NAME,
  host: NODEMAILER_SMTP_HOST,
  port: NODEMAILER_SMTP_PORT,
  secure: NODEMAILER_SMTP_SECURE,
  auth: { user, pass },
});
