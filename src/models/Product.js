const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Mountain Bike",
        "Road Bike",
        "Hybrid Bike",
        "Electric Bike",
        "Kids Bike",
        "Accessories",
      ],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      current: {
        type: Number,
        required: true,
        min: 0,
      },
      original: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    specifications: {
      motorPower: String,
      batteryCapacity: String,
      rangeKm: Number,
      weightKg: Number,
      maxSpeedKmh: Number,
      brakes: String,
      foldable: Boolean,
    },
    features: [
      {
        type: String,
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    variants: [
      {
        variantId: String,
        name: String,
        price: Number,
      },
    ],
    reviews: {
      ratingAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      ratingCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
