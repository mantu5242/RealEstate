const userModel = require("../../Models/UserModel")
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken')

  



const loginController=async(req,res)=>{
  try {
      const {email,password}=req.body
    //   console.log(email , password);
      const user=await userModel.findOne({email})
      
      if(!user){
          return res.status(200).json({message:'User not found',success:false})
      }
      const isMatch=await bcrypt.compare(password,user.password)
      if(!isMatch){
          return res.status(200).json({message:'Invalid Email and Password',success:false})
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{ expiresIn: '1h' });
      
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
      const { password: pass, ...rest } = user._doc;
      res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    
  } catch (error) {
      return res.status(404).json({message:`Error in logging ${error}`,success:false})
  }
}


const googleAuthController = async(req,res,next) => {
        //  console.log(req.body)
    try{
        const user = await userModel.findOne({email:req.body.email})
        // console.log(req.body);
        if(user){
            console.log("user pehle se hi hai , check for sending response")
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: '1h' });
            console.log("token",token);
            // console.log(user);
            const {password:pass, ...rest} = user._doc;
            res.cookie('access_token', token, { httpOnly: true, sameSite: 'None', secure: true });
            console.log("Res.cookie", req.cookies.access_token)

            return res.status(200).json({message:'login successfully',success:true,rest})
        }
        else{
            // console.log("user nhi mila, banana padega")
            const generatedPassword = Math.random().toString(36).slice(-8);
            // console.log(generatedPassword)
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(generatedPassword, salt);
          
            //console.log(hashedPassword);
            const newUser = new userModel({
                username: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            
            await newUser.save();
           
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:pass, ...rest} = newUser._doc;
            res.cookie('access_token',token,{httpOnly:true});
            return res.status(200).json({message:'login successfully',success:true,rest})
        }
    }
    catch(error){
        return res.status(404).json({message:`Error in logging ${error}`,success:false})
    }
}


const signUpController = async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        // console.log(req.body);
        // const hashedPassword = bcryptjs.hashSync(password,10)
        const existUser = await userModel.findOne({email});
        if(existUser){
            return res.status(201).json({message:'user already exist'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        req.body.password=hashedPassword;
        // console.log(password);
        // const newUser = new userModel({username,email,password});
        const newUser = new userModel(req.body);
        await newUser.save();
        // console.log(newUser);
        return res.status(200).json({message:"user created successfully",success:true});
    }
    catch(error){
        console.log(error);
        next | errorHandler(500,'error from the function');
        
    }
}


const logOutController = async(req,res,next) => {
    // console.log("logoutcontroller")
    try{
        console.log("logout.....")
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    }
    catch(e){
        next(e);
    }
}



module.exports = {loginController,signUpController,googleAuthController,logOutController};