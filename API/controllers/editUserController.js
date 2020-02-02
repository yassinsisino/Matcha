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

const editBio = (req, res) => {
    editUserModel.editBio(req, res);
}

const editGender = (req, res) => {
    editUserModel.editGender(req, res);
}

const editPassword = (req, res) => {
    editUserModel.editPassword(req, res);
}

const editOrientation = (req, res) => {
    editUserModel.editOrientation(req, res);
}

const editMail = (req, res) => {
    editUserModel.editMail(req, res);
}

const editPhotos = (req, res) => {
    editUserModel.editPhotos(req, res);
}

module.exports = {
    editUsername,
    editFirstname,
    editLastname,
    editBirthDate,
    editBio,
    editGender,
    editPassword,
    editOrientation,
    editMail,
    editPhotos,
}
