const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      featured, 
      page = 1, 
      limit = 12,
      sort = "featured", // featured, priceLow, priceHigh
      // Filter parameters
      inStock,
      style,
      ridingStyles,
      frameType,
      poster,
      drivetrain,
      electricAssistRange,
      payload,
      riderHeight,
      suspension,
      colors,
      weightMin,
      weightMax,
      priceMin,
      priceMax
    } = req.query;
    
    const query = { isListed: true }; // Only show listed products

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };
    if (featured) query.featured = featured === "true";
    
    // Filter queries
    if (inStock !== undefined && inStock !== null && inStock !== "") {
      query.inStock = inStock === "true" || inStock === true;
    }
    // Handle ridingStyles first (takes precedence if both are provided)
    if (ridingStyles) {
      // ridingStyles maps to the style field for riding style filtering
      if (Array.isArray(ridingStyles)) {
        query.style = { $in: ridingStyles };
      } else {
        query.style = ridingStyles;
      }
    } else if (style) {
      // Only use style if ridingStyles is not provided
      if (Array.isArray(style)) {
        query.style = { $in: style };
      } else {
        query.style = style;
      }
    }
    if (drivetrain) {
      if (Array.isArray(drivetrain)) {
        query.drivetrain = { $in: drivetrain };
      } else {
        query.drivetrain = drivetrain;
      }
    }
    if (electricAssistRange) {
      if (Array.isArray(electricAssistRange)) {
        query.electricAssistRange = { $in: electricAssistRange };
      } else {
        query.electricAssistRange = electricAssistRange;
      }
    }
    if (payload) {
      // If array, get max value; if single, use it directly
      let payloadNum;
      if (Array.isArray(payload)) {
        payloadNum = Math.max(...payload.map(p => parseInt(p)));
      } else {
        payloadNum = parseInt(payload);
      }
      if (!isNaN(payloadNum)) {
        query.payload = { $gte: payloadNum };
      }
    }
    if (riderHeight) {
      if (Array.isArray(riderHeight)) {
        query.riderHeight = { $in: riderHeight };
      } else {
        query.riderHeight = { $in: [riderHeight] };
      }
    }
    if (suspension) {
      if (Array.isArray(suspension)) {
        query.suspension = { $in: suspension };
      } else {
        query.suspension = suspension;
      }
    }
    if (frameType) {
      // frameType is in specifications object
      if (Array.isArray(frameType)) {
        query["specifications.frameType"] = { $in: frameType };
      } else {
        query["specifications.frameType"] = frameType;
      }
    }
    if (poster) {
      if (Array.isArray(poster)) {
        query.poster = { $in: poster };
      } else {
        query.poster = poster;
      }
    }
    if (colors) {
      // Colors are now objects with name and quantity, so we filter by color.name
      const colorNames = Array.isArray(colors) ? colors : [colors];
      query["colors.name"] = { $in: colorNames };
    }
    if (weightMin || weightMax) {
      query.weight = {};
      if (weightMin) query.weight.$gte = parseFloat(weightMin);
      if (weightMax) query.weight.$lte = parseFloat(weightMax);
    }
    if (priceMin || priceMax) {
      query["price.current"] = {};
      if (priceMin) query["price.current"].$gte = parseFloat(priceMin);
      if (priceMax) query["price.current"].$lte = parseFloat(priceMax);
    }

    const skip = (page - 1) * limit;
    
    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === "priceLow") {
      sortOption = { "price.current": 1 };
    } else if (sort === "priceHigh") {
      sortOption = { "price.current": -1 };
    }
    
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip(skip)
      .sort(sortOption);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.uploadedImages && req.uploadedImages.length > 0) {
      productData.images = req.uploadedImages;
    }

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Start with ALL data from req.body
    const productData = { ...req.body };

    // Handle images
    let finalImages = [];
    if (productData.existingImages && Array.isArray(productData.existingImages) && productData.existingImages.length > 0) {
      finalImages = [...productData.existingImages];
    }
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      finalImages = [...finalImages, ...req.uploadedImages];
    }
    if (finalImages.length > 0) {
      productData.images = finalImages;
    } else if (productData.existingImages && Array.isArray(productData.existingImages) && productData.existingImages.length === 0) {
      productData.images = [];
    }
    delete productData.existingImages;

    // Ensure price is properly set
    if (!productData.price && existingProduct.price) {
      productData.price = existingProduct.price;
    } else if (productData.price) {
      // Ensure current is a number
      if (productData.price.current !== undefined && productData.price.current !== null) {
        productData.price.current = typeof productData.price.current === 'number' 
          ? productData.price.current 
          : parseFloat(productData.price.current) || existingProduct.price?.current || 0;
      } else {
        productData.price.current = existingProduct.price?.current || 0;
      }
      // Ensure currency
      if (!productData.price.currency) {
        productData.price.currency = existingProduct.price?.currency || "USD";
      }
      // Remove original if not provided or 0
      if (!productData.price.original || productData.price.original === 0) {
        delete productData.price.original;
      }
    }

    // Ensure arrays exist
    if (!productData.features) productData.features = [];
    if (!productData.variants) productData.variants = [];

    // Update using $set to ensure nested objects update correctly
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productData },
      {
      new: true,
      runValidators: true,
      }
    );
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(400).json({ 
      message: error.message,
      error: error.name 
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
