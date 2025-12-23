const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require("stream");
const dns = require("dns");

// Prefer IPv4 over IPv6 to avoid connection issues in WSL2
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

// Configure Cloudinary (only if credentials are provided)
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 60000, // 60 seconds timeout
    api_proxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY, // Support proxy if needed
  });
} else {
  console.warn(
    "⚠️  Cloudinary credentials not found. Image uploads will not work."
  );
}

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."), false);
    }
  },
});

// Helper function to upload buffer to Cloudinary with retry logic
const uploadToCloudinary = (buffer, folder = "ecowheels/products", retries = 3) => {
  return new Promise((resolve, reject) => {
    const attemptUpload = (attemptNumber) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          transformation: [
            {
              width: 1000,
              height: 1000,
              crop: "limit",
              quality: "auto",
            },
          ],
          timeout: 60000, // 60 seconds timeout per attempt
        },
        (error, result) => {
          if (error) {
            // Retry on network errors
            if (
              (error.code === 'ETIMEDOUT' || 
               error.code === 'ENETUNREACH' || 
               error.code === 'ECONNRESET') &&
              attemptNumber < retries
            ) {
              console.log(`Upload attempt ${attemptNumber} failed, retrying... (${retries - attemptNumber} attempts left)`);
              setTimeout(() => attemptUpload(attemptNumber + 1), 2000 * attemptNumber); // Exponential backoff
            } else {
              reject(error);
            }
          } else {
            resolve(result);
          }
        }
      );

      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    };

    attemptUpload(1);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };

