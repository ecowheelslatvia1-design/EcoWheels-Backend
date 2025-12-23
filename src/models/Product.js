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
      details: {
        modelName: {
          type: String,
          required: false,
        },
        modelNumber: {
          type: String,
          required: false,
        },
        NetWeight: {
          type: Number,
          required: false,
        },
        Payload: {
          type: Number,
          required: false,
        },
      },
      FrameSet: {
        Frame: {
          type: String,
          required: false,
        },
        Fork: {
          type: String,
          required: false,
        },
        Headset: {
          type: String,
          required: false,
        },
      },
      "E-System": {
        driveUnit: {
          type: String,
          required: false,
        },
        battery: {
          type: String,
          required: false,
        },
        charger: {
          type: String,
          required: false,
        },
        display: {
          type: String,
          required: false,
        },
        throttle: {
          type: String,
          required: false,
        },
      },
      DRIVETRAIN: {
        "Rear Derailleur": {
          type: String,
          required: false,
        },
        Shifters: {
          type: String,
          required: false,
        },
        Chain: {
          type: String,
          required: false,
        },
        Crank: {
          type: String,
          required: false,
        },
        "Rear Cogs": {
          type: String,
          required: false,
        },
        Sensor: {
          type: String,
          required: false,
        },
      },
      BRAKES: {
        Brakes: {
          type: String,
          required: false,
        },
        "Brake Levers": {
          type: String,
          required: false,
        },
      },
      Wheels: {
        "Front Hub": {
          type: String,
          required: false,
        },
        "Rear Hub": {
          type: String,
          required: false,
        },
        Tires: {
          type: String,
          required: false,
        },
        Rims: {
          type: String,
          required: false,
        },
        Spokes: {
          type: String,
          required: false,
        },
      },
      Components: {
        Handlebars: {
          type: String,
          required: false,
        },
        Stem: {
          type: String,
          required: false,
        },
        Grips: {
          type: String,
          required: false,
        },
        Saddle: {
          type: String,
          required: false,
        },
        Seatpost: {
          type: String,
          required: false,
        },
      },
      frameType: {
        type: String,
        required: false,
        enum: ["Foldable", "Low step","Mid step","High step"],
      },
    },
    // Filter fields
    style: {
      type: String,
      enum: ["Urban Commuting", "Off-road / Mountain Riding", "Long-distance Touring", "Leisure Riding / Daily Errands", "Cargo & Delivery Use"],
    },
    poster: {
      type: String,
      enum: ["Upright", "Active", "Sporty"],
    },
    drivetrain: {
      type: String,
      enum: ["Chain", "Belt"],
    },
    electricAssistRange: {
      type: String,
      enum: ["43-60 mile", ">60 mile"],
    },
    payload: {
      type: Number, // in lbs
    },
    riderHeight: [
      {
        type: String, // e.g., "150cm(4'11\") - 185cm(6'1\")"
      },
    ],
    suspension: {
      type: String,
      enum: [
        "Front Suspension",
        "Full Suspension",
        "No Suspension / Rigid Fork",
      ],
    },
    colors: [
      {
        name: {
          type: String,
          enum: ["White", "Green", "Blue", "Grey", "Black"],
          required: true,
        },
        quantity: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    weight: {
      type: Number, // in lbs
    },
    tagline: {
      type: String, // Short descriptive text under product name
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
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    isListed: {
      type: Boolean,
      default: true,
    },
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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
