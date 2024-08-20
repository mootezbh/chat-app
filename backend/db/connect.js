const mongoose = require("mongoose");

const URI = process.env.MONGO_DB_URI;

const connect = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
