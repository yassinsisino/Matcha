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
    if (token === undefined)
        return res.status(401).json({ code: 401 , message: 'Authentification required'});
    jwt.verify(token, privateKey, (err, decode) => {
        if (err){
            console.log(err.message);
            return res.status(400).json({ code: 400, message: 'Invalide token'})
        }
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