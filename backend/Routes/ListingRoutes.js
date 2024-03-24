const express = require('express');
const { createListController, deleteListsController, updateListController, getListController, getlistingController } = require('../api/controllers/listingController');
const verifyToken = require('../api/utils/verifyUser');
const router = express.Router();

router.post('/create',verifyToken,createListController);
router.delete('/delete/:id',verifyToken,deleteListsController)
router.post('/update/:id',verifyToken,updateListController)
router.get('/get/:id',getListController)
router.get('/get',getlistingController)

module.exports = router;

