const editUserModel = require('../models/editUserModel');

const editUsername = (req, res) => {
    editUserModel.editUsername(req, res);
}

const editFirstname = (req, res) => {
    editUserModel.editFirstname(req, res);
}

const editLastname = (req, res) => {
    editUserModel.editLastname(req, res);    
}

const editBirthDate = (req, res) => {
    editUserModel.editBirthDate(req, res);
}

module.exports = {
    editUsername,
    editFirstname,
    editLastname,
    editBirthDate,
}
