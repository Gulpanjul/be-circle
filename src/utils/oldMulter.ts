import path from 'path';

import multer from 'multer';

const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.filename + '-' + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

export const uploadImage = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }

    cb(null, true);
  },
});
