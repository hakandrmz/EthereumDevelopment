const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    address: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    isAdmin: {
      type: Boolean,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  });
  module.exports = mongoose.model("User", userSchema);
  