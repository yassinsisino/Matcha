const express = require('express');

const userRoute = express.Router();
const userController = require('../controllers/userController');
const login = require('../utils/jwt');

userRoute.route('/signup')
.post(userController.userSignup);

userRoute.route('/activation/:activationKey')
.get(userController.activateAccount);

userRoute.route('/login')
.post(userController.userLogin)

userRoute.use('/', login.checkToken)
userRoute.route('/')
.get(userController.getUsers)



module.exports  = userRoute;