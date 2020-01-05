const express = require('express');

const tagsRoute = express.Router();

const tagsController = require('../controllers/tagsController');
const login = require('../utils/jwt');

tagsRoute.use('/', login.checkToken);

tagsRoute.route('/add')
    .post(tagsController.addUserTag);

tagsRoute.route('/delete')
    .post(tagsController.deleteUserTag);

module.exports = tagsRoute;