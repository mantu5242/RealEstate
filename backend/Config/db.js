const mongoose = require("mongoose");
const colors = require("colors");
// const dotenv = require("dotenv")

// dotenv.config()
const uri = "mongodb+srv://mantukr5242:Mantu%405242@cluster0.z09kcvd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const uri = "mongodb://127.0.0.1:27017/RealStateApp"
const connectDB = async () => {
  try {
    console.log("db",uri)
    await mongoose.connect(uri,{useNewUrlParser: true });
    console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white);
  } catch (error) {
    console.log(`Mongodb Server Issue ${error}`.bgRed.white);
  }
};

module.exports = connectDB;
