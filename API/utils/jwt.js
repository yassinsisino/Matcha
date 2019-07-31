const jwt = require('jsonwebtoken');

const privateKey = 'The-Secret-Key-For-Match-42';
const jwtOption = {
    expiresIn: '24h',
};

const getToken = (payload, callback) => {
    jwt.sign(payload, privateKey, jwtOption, (err, token) => {
        if (err)
            callback(err, null);
        else if (token)
            callback(null, token)
    })
}

const checkToken = (req, res, next) => {
    const token  = req.headers.authorization;
    jwt.verify(token, privateKey, (err, decode) => {
        if (err){
            console.log(err);
            return res.status(400).json({ code: 400, message: 'Invalide Token'})
        }
        console.log('token valide');
        next();
    })
}

const decodeToken = (token) => {
    return jwt.decode(token)
}

module.exports = {
    getToken,
    checkToken,
    decodeToken,
}