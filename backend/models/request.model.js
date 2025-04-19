import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    typeofration: {
      type: String,
      required: true,
      enum:["Yellow","Orange","White"]
    },
    summary: { type: String, default: null }, // Add this field
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
     
    ],
    rationcardnumber:{
      type: String || null,
    
    },
  },
  { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);
