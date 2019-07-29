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

module.exports = {
    getToken,
}