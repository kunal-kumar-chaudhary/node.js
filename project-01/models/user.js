const mongoose = require("mongoose");

// defining a schema
const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true, 
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
  });

// creating a model
// note - mongoose by default adds an "s" to the model name and makes it plural
const User = mongoose.model("user", userSchema);

module.exports = User;