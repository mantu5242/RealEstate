// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
        // unique:true
    },
    avatar:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwh8-ce_Y_rXLLTXOEbZAhyrfuk_KoDtT_bVs2ymftAw&s",
    },
},{timestamps:true});

const userModel = mongoose.model('User',userSchema);


module.exports=userModel;
