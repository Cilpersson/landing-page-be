import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  phoneNbr: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  zipCode: {
    type: Number,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
