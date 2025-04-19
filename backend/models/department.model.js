import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String, 
    },
    logo:{
        type:String // URL to company logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

export const Department = mongoose.model("Department", departmentSchema);