import cloudinary from './cloudinaryConfig.js';
import streamifier from 'streamifier';

export const uploadBufferToCloudinary = (buffer, folder = 'app/uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // image/pdf auto
        // you can also set transformation here if image
        // transformation: [{ width: 800, crop: 'limit' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); // contains secure_url, public_id, etc
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
