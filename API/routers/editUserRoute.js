const express = require('express');

const editUserRoute = express.Router();
const editUserController = require('../controllers/editUserController');
const jwt = require('../utils/jwt');

editUserRoute.use('/', jwt.checkToken);

editUserRoute.route('/username')
.put(editUserController.editUsername);
editUserRoute.route('/firstname')
.put(editUserController.editFirstname);
editUserRoute.route('/lastname')
.put(editUserController.editLastname);
editUserRoute.route('/birth')
.put(editUserController.editBirthDate);
editUserRoute.route('/bio')
.put(editUserController.editBio);
editUserRoute.route('/gender')
.put(editUserController.editGender);
editUserRoute.route('/password')
.put(editUserController.editPassword);

module.exports = editUserRoute;