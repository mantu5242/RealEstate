const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require('./Config/db');
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const router = require("./Routes/UserRoutes")
mongoose.set('strictQuery', true);
const cors = require('cors');


const app = express();


app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config()


// mongodb connection
mongoose.set('strictQuery', true)
connectDB();

// mongoose.connect(process.env.MONGO_URL);


// req = data that we get from client side
// res = data that we sent back to client side

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use('/api/auth',require("./Routes/UserRoutes"));
app.use('/api/user',require('./Routes/UserRoutes'));
app.use('/api/listing',require('./Routes/ListingRoutes'));

app.use((err,req,res,next) => {
    const  statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
})


// app.use('/api/v1/user',require('./Routes/user-routes'))


app.listen(8000,()=>{
    console.log("server is running on port 8000");
})