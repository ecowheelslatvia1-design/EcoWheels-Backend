const app = require("./app");
const connectDB = require("./config/database");
const seedAdmin = require("./config/seedAdmin");
const serverless = require("@codegenie/serverless-express");
let serverlessHandler;

export default {
  async fetch(request, env, ctx) {
    await connectDB();
    await seedAdmin();

    if (!serverlessHandler) {
      serverlessHandler = serverless({ app });
    }

    return serverlessHandler(request, env, ctx);
  },
};
