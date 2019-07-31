const db = require('../database/index');
const jwt = require('../utils/jwt');


const editUsername = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    console.log(decode);
}

module.exports = {
    editUsername,
}