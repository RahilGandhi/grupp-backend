require("dotenv").config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database Connection Failed - ', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;