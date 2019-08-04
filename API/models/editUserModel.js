const jwt = require('../utils/jwt');
const htmlSpecialChars = require('htmlspecialchars');


const editUsername = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    console.log(decode);
    const idUser = decode.idUser;
    const newUsername =  htmlSpecialChars(req.body.username);
}

module.exports = {
    editUsername,
}