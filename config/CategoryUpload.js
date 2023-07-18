/* 
* Cloudinary is an end-to-end image and video management solution for websites and mobile apps.
* It covers everything from image and video uploads, storage, manipulations, and optimizations to delivery
*/
import cloudinaryPackage from "cloudinary";
/* Multer is a node.js middleware for handling multipart/form-data,
* which is primarily used for uploading files.
* It is written on top of busboy for maximum efficiency.
* https://expressjs.com/en/resources/middleware/multer.html
*/
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// configurar cloudinary
const cloudinary = cloudinaryPackage.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

// Cria mecanismo de armazenamento multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "ecomerce-api",
  },
});

// Inicia com mecanismo de armazenamento criado
const catetgoryFileUpload = multer({ storage: storage });

export default catetgoryFileUpload;
