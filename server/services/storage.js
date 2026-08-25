import crypto from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';

const extByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
  'application/pdf': '.pdf',
};

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function configure() {
  if (!cloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export function extensionFor(file) {
  return extByMime[file.mimetype] || '';
}

export function validateFileSignature(file) {
  const b = file.buffer;
  if (!b || !b.length) return false;

  switch (file.mimetype) {
    case 'image/jpeg':
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'image/png':
      return b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    case 'image/webp':
      return b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP';
    case 'application/pdf':
      return b.subarray(0, 5).toString() === '%PDF-';
    case 'image/x-icon':
    case 'image/vnd.microsoft.icon':
      return b[0] === 0 && b[1] === 0 && (b[2] === 1 || b[2] === 2);
    default:
      return false;
  }
}

export async function saveUpload(file, folder = 'assets') {
  if (!extensionFor(file)) throw new Error('Unsupported file type');
  if (!validateFileSignature(file)) {
    throw new Error('File content does not match its declared type');
  }

  configure();

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'assets';
  const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
  const publicId = `${safeFolder}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: safeFolder,
        public_id: publicId.split('/').pop(),
        resource_type: resourceType,
        ...(resourceType === 'raw' ? { format: 'pdf' } : {}),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          filename: result.original_filename || publicId.split('/').pop(),
          urlPath: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      },
    );

    stream.end(file.buffer);
  });
}

export async function removeUpload(urlPath) {
  // Existing records may contain old local /uploads URLs. They are ignored.
  if (!urlPath || !urlPath.includes('res.cloudinary.com')) return;

  try {
    configure();

    const marker = '/upload/';
    const index = urlPath.indexOf(marker);
    if (index === -1) return;

    let publicPath = urlPath.slice(index + marker.length);
    publicPath = publicPath.replace(/^v\d+\//, '');

    const parts = publicPath.split('/');
    const fileName = parts.pop() || '';
    const folder = parts.join('/');
    const publicId = `${folder}/${fileName}`.replace(/\.[^.]+$/, '');

    const resourceType = urlPath.includes('/raw/upload/') ? 'raw' : 'image';
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete failed:', error.message);
  }
}
