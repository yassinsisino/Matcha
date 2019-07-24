const userModel = require('../models/userModel');

const userSignup =  (req, res) => {
    userModel.addUser(req, res);
};

const activateAccount = (req, res) => {
    userModel.activateAccount(req, res);
}

module.exports = {
    userSignup,
    activateAccount,
}