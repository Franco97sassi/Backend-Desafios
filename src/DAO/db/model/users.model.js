import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  cart: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
      default: null,
    },
  },
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: Date,
});

export const userModel = mongoose.model("users", userSchema);