const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const uploadImages = require("../middleware/uploadImages");
const parseFormData = require("../middleware/parseFormData");

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    admin,
    upload.array("images", 10), // Allow up to 10 images
    parseFormData,
    uploadImages,
    createProduct
  );

router
  .route("/:id")
  .get(getProductById)
  .put(
    protect,
    admin,
    upload.array("images", 10), // Allow up to 10 images
    parseFormData,
    uploadImages,
    updateProduct
  )
  .delete(protect, admin, deleteProduct);

module.exports = router;
