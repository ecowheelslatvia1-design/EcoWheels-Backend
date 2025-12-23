const User = require("../models/User");

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@admin.com" });

    if (!adminExists) {
      // Create admin user with hardcoded credentials
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD, // Simple password
        role: "admin",
      });

      console.log("✅ Admin user created successfully!");
      console.log("📧 Email: admin@admin.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
  }
};

module.exports = seedAdmin;

