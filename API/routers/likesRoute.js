const express = require('express');

const likesController = require('../controllers/likesController');
const login = require('../utils/jwt');


const likesRoute = express.Router();

likesRoute.route('/')
    .all(login.checkToken)

likesRoute.route('/like')
    .post(likesController.likeUser);

likesRoute.route('/unlike')
    .post(likesController.unlikeUser);

module.exports = likesRoute;