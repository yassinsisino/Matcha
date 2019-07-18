const pool = require('../database/index');

const addUser = (req, res) => {
    console.log('partie model');
    console.log(req.body);
    res.status(200).json(req.body);
}

const getUserByMail = (req, res) => {
    console.log('model get user by mail');
    console.log(req.body.mail);
    const request = {
        name: 'get user by mail',
        text: 'SELECT * FROM users WHERE mail = $1',
        values: [req.body.mail]
    }
    pool.query(request)
    .then( (res1) => {
        console.log('return value', res1.rowCount)
        return res1.rowCount;
    })
    .catch((err) => {
        console.error(err.stack)
    })
}

module.exports = {
    addUser,
    getUserByMail,
}