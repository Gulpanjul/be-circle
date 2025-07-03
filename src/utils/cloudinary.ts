import { v2 as cloudinary } from 'cloudinary';

import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../utils/env';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const regex = /\/upload\/(?:v\d+\/)?([^\.]+)\./; // cocokkan path setelah /upload/
    const match = url.match(regex);
    return match ? match[1] : null; // contoh: 'avatars/username'
  } catch {
    return null;
  }
}

export default cloudinary;
