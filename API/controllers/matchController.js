const matchModel = require('../models/matchModel');
const jwt = require('../utils/jwt');


const getMatch = (req, res) => {
    const idUser = jwt.decodeToken(req.headers.authorization).idUser;
    matchModel.getMatch(idUser)
        .then(data => {
            // console.log(data.rows)
            return res.status(200).json({code: 200, matches: data.rows})
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ code: 400, message: 'Error to get user Like' });
        })
}

module.exports = {
    getMatch,
}