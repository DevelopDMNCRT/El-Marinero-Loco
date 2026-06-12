require('dotenv').config({ path: './.env' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary upload...');
// Create a tiny 1x1 png image
const imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

cloudinary.uploader.upload(imageBase64, { folder: 'El Marinero Loco' }, (error, result) => {
  if (error) {
    console.error('Cloudinary Error:', error);
  } else {
    console.log('Success! URL:', result.secure_url);
    // clean up
    cloudinary.uploader.destroy(result.public_id, () => {
      console.log('Cleanup done.');
    });
  }
});
