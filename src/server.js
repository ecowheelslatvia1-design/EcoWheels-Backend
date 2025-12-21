const app = require("./app");
const connectDB = require("./config/database");
const seedAdmin = require("./config/seedAdmin");

// Connect to database
connectDB().then(async () => {
  // Seed admin user after database connection
  await seedAdmin();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
});
