// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'
// const uploadOnCloudinary = async (file) => {
    
//         cloudinary.config({
//             cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//             api_key: process.env.CLOUDINARY_API_KEY,
//             api_secret: process.env.CLOUDINARY_API_SECRET
//         })

//       const fixedPath = file.replace(/\\/g, "/");
// const result = await cloudinary.uploader.upload(fixedPath, {
//   resource_type: "auto",
// });

//         return result
// }

// export default uploadOnCloudinary



// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'

// const uploadOnCloudinary = async (file) => {
//   try {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     })

//     const result = await cloudinary.uploader.upload(file, {
//       resource_type: 'auto'
//     })

//     // 👉 Local file delete after upload
//     fs.unlinkSync(file)

//     return result
//   } catch (error) {
//     // Agar upload fail ho jaye to bhi local file hatado
//     fs.unlinkSync(file)
//     throw error
//   }
// }

// export default uploadOnCloudinary

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      type: "upload",
      access_mode: "public",
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Cloudinary upload error:", error.message);
    throw error;
  }
};

export default uploadOnCloudinary;
