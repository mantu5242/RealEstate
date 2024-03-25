const userModel = require('../../Models/UserModel');
const listModel = require('../../Models/listModel');
const errorHandler = require('../utils/error');


const createListController = async(req,res,next) => {
    try{
        // console.log(req.body);
        const listing = await listModel.create(req.body);
        return res.status(201).json(listing);
    }
    catch(error){
        next(error)
    }
}

const deleteListsController = async (req, res, next) => {
  try {
    const listing = await listModel.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    
    if (req.id !== listing.userRef) {
      
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    console.log("user id is also checked...")
      await listModel.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };


  const updateListController = async(req,res,next) => {
    try{
      const list = await listModel.findById(req.params.id);
      if(!list) {
        return next(errorHandler(404,'List not found'))
      }
      if(req.id != list.userRef){
        return next(errorHandler(401, 'You can only update your own listings!'));
      }
      const newlist = await listModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
      );
      res.status(200).json(newlist);
    }
    catch(error){
      next(error);
    }
  }

const getListController = async(req,res,next) => {

  console.log(req.params.id)
  try{
    const list = await listModel.findById(req.params.id);
    
    if(!list){
      return next(errorHandler(404,"list not found"))
    }
    res.status(200).json(list);
  }
  catch(error){
    next(error)
  }
}


const getlistingController = async(req,res,next) => {
  try{

    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex)||0;
    let offer = req.query.offer;

    if(offer === undefined || offer === 'false'){
      offer = {$in: [false,true]};
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
      furnished = {$in:[false , true]};
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
      parking = {$in: [false, true] };
    }

    let type = req.query.type;
    if(type === undefined || type === 'all'){
      type = {$in:['sale' , 'rent']};
    }

    const searchTerm = req.query.searchTerm||'';
    const sort = req.query.sort || 'createAt';

    const order = req.query.order || 'desc';

    const listings = await listModel.find({
      name: {$regex: searchTerm, $options:'i'},
      offer,
      furnished,
      parking,
      type,
  }).sort(
    {[sort]:order}
  ).limit(limit).skip(startIndex);

  
  return res.status(200).json(listings);

  }
  catch(error){
    next(error);
  }
}

module.exports = {createListController,deleteListsController,updateListController,getListController,getlistingController};