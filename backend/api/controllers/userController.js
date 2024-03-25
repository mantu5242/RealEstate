const userModel = require("../../Models/UserModel");
const listModel = require("../../Models/listModel");
const errorHandler = require("../utils/error");

const testController = async(req,res) => {
    try{
        res.json({
            message:"hello",
        })
    }
    catch(error){
        console.log(error);
    }
}

const updateUserController = async(req,res,next) => {
    console.log("update user")
    try{
        console.log(req.body);
        console.log(req.body.username);
        if(req.id != req.params.id) return next(errorHandler(401,"You can only update your own account"))
        // console.log(req.bodyusername)
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password= await bcrypt.hash(req.body.password,salt);
        }
        console.log("password bcrypted ")
        const updateUser = await userModel.findByIdAndUpdate(req.params.id,{
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true})
        console.log("update ho gya")
        const {password, ...rest} = updateUser._doc
        console.log(updateUser);

        res.status(200).json(rest)

    }
    catch(error){
        next(error)
    }
}

const deleteUserController = async(req,res,next) => {
    try{
        if(req.id != req.params.id){
            return next(errorHandler(401,'You can only delete your own account!'));
        }
        await userModel.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted !');
    }
    catch(error){
        next(error);
    }
}

const getUserListsController = async(req,res,next) => {

    // console.log("getusercontroller")
    console.log(req.params.id)
    try{
        if(req.id == req.params.id){
            const lists = await listModel.find({userRef: req.params.id});
            // console.log("lists",lists)
            res.status(200).json(lists);
        }
        else{
            return next(errorHandler(401,"You can only view your own lists"))
        }
    }
    catch(error){
        next(error);
    }
}


const getUserController = async (req, res, next) => {
    try {
      
      const user = await userModel.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

module.exports = {testController,updateUserController,deleteUserController,getUserListsController,getUserController};

