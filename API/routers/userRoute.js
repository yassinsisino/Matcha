const express = require('express');

const userRoute = express.Router();
const userController = require('../controllers/userController');


userRoute.route('/signup')
.post(userController.userSignup);

userRoute.route('/activation/:activationKey')
.get(userController.activateAccount);

userRoute.route('/login')
.post(userController.userLogin)


module.exports  = userRoute;