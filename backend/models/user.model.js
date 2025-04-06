import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["citizen", "government"],
    required: true,
  },
  profile: {
    bio: { type: String },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: undefined,
  },
},{timestamps:true});

// Create the User model
export const User = mongoose.model("User", userSchema);
