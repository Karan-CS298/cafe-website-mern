import multer from 'multer';

const storage = multer.memoryStorage();
const max = Number(process.env.MAX_UPLOAD_MB || 8) * 1024 * 1024;
const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'application/pdf',
]);

export const upload = multer({
  storage,
  limits: { fileSize: max, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new Error('Unsupported file type. Use JPG, PNG, WebP, ICO or PDF.'));
    cb(null, true);
  },
});
