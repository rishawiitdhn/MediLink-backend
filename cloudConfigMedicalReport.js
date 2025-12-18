const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.mimetype === "application/pdf") {
      return {
        folder: "MediLink-Medical-Reports",
        resource_type: "raw",
        format: "pdf",
      };
    }

    // for images
    return {
      folder: "MediLink-Medical-Reports",
      resource_type: "image",
    };
  },
});
//for opening the pdf in browser, change the cloudinary security setting. Go to the pdf and zip file section and check it.
module.exports = { cloudinary, storage };
