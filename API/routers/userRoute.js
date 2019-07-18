const express = require('express');

const userRoute = express.Router();
const userController = require('../controllers/userController');


userRoute.route('/signup')
.post(userController.userSignup);


module.exports  = userRoute;