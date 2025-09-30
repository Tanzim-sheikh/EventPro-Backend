import multer from 'multer';

const storage = multer.memoryStorage(); // file buffer milega -> streamify karke upload
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (adjust)
  fileFilter: (req, file, cb) => {
    // allow images and pdf for docs
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only images and pdfs are allowed'), false);
    }
  }
});
