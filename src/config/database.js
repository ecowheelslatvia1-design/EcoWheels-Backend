const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/cycle-ecommerce";

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(
      "\n💡 Make sure MongoDB is running:\n" +
        "   - Local: Start MongoDB service\n" +
        "   - Or update MONGODB_URI in .env file to point to your MongoDB instance"
    );
    process.exit(1);
  }
};

module.exports = connectDB;
