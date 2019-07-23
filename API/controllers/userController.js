const userModel = require('../models/userModel');
const util = require('util');

exports.userSignup =  (req, res) => {
    userModel.addUser(req, res);
};