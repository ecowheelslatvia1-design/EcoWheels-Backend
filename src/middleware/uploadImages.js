const { uploadToCloudinary } = require("../config/cloudinary");

// Middleware to handle multiple image uploads
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(); // No files to upload, continue
    }

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        message: "Cloudinary is not configured. Please check your .env file.",
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

    const uploadResults = await Promise.all(uploadPromises);

    // Extract secure URLs from Cloudinary response
    req.uploadedImages = uploadResults.map((result) => result.secure_url);

    next();
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({
      message: "Error uploading images",
      error: error.message,
    });
  }
};

module.exports = uploadImages;

