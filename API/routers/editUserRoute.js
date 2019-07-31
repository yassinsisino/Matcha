const express = require('express');

const editUserRoute = express.Router();
const editUserController = require('../controllers/editUserController');
const jwt = require('../utils/jwt');


editUserRoute.route('/')
.all(jwt.checkToken);

editUserRoute.route('/username')
.put(editUserController.editUsername);

module.exports = editUserRoute;