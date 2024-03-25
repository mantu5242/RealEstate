const express = require("express");

// const {testController} = require("../api/controllers/userController")
const {loginController, signUpController, googleAuthController, logOutController} = require("../api/controllers/authController")
const router = express.Router();
const verifyToken = require('../api/utils/verifyUser');
const { updateUserController, deleteUserController, getUserListsController, getUserController } = require("../api/controllers/userController");



router.post("/login", loginController);
router.post('/google',googleAuthController)
router.post('/register',signUpController);
router.put('/update/:id',verifyToken,updateUserController);
router.delete('/delete/:id',verifyToken,deleteUserController);
router.get('/logout',logOutController);
router.get('/lists/:id',verifyToken,getUserListsController)
router.get('/:id', verifyToken, getUserController)


module.exports = router;
