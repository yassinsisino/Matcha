const userModel = require('../models/userModel');

const userSignup =  (req, res) => {
    userModel.addUser(req, res);
};

const activateAccount = (req, res) => {
    console.log('controller activateAccount ')
    userModel.activateAccount(req, res);
}

module.exports = {
    userSignup,
    activateAccount,
}