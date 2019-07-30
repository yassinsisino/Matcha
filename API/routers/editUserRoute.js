const express = require('express');
const editUserModel = require('../models/editUserModel');

const editUserRoute = express.Router();

editUserRoute.route('/username')
.put(editUserModel.editUsername);

module.exports = {
    editUserRoute,
}