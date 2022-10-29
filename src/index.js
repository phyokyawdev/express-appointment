const mongoose = require("mongoose");
const keys = require("./config/keys");
const app = require("./app");
const port = 3000;

const start = async () => {
  try {
    await mongoose.connect(keys.mongoURI);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    throw new Error("db connection failed");
  }

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
