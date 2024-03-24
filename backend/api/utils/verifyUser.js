const jwt = require("jsonwebtoken");
const errorHandler = require("./error");
const verifyToken = (req,res,next) => {

    const token = req.cookies.access_token;
    console.log("getcontact from ",token)
    if(!token){ 
        return next(errorHandler(401,'Unauthorized'))
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
}

module.exports = verifyToken;

