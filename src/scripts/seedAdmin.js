require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/cycle-ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@admin.com" });

    if (!adminExists) {
      // Create admin user with hardcoded credentials
      const admin = await User.create({
        name: "Admin",
        email: "admin@admin.com",
        password: "admin123", // Simple password
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("📧 Email: admin@admin.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("ℹ️  Admin user already exists");
      console.log("📧 Email: admin@admin.com");
      console.log("🔑 Password: admin123");
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();


