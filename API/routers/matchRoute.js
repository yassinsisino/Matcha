const express = require('express');

const matchController = require('../controllers/matchController')

const login = require('../utils/jwt');


const matchesRoute = express.Router();

matchesRoute.use('/', login.checkToken);

matchesRoute.route('/match')
    .get(matchController.getMatch);


module.exports = matchesRoute;
