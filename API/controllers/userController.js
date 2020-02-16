const userModel = require('../models/userModel');
const userAction = require('../models/userAction');
const jwt = require('../utils/jwt');
const htmlSpecialChars = require('htmlspecialchars');
const moment = require('moment');

const userSignup = (req, res) => {
    userModel.addUser(req, res);
};

const activateAccount = (req, res) => {
    userModel.activateAccount(req, res);
}

const userLogin = (req, res) => {
    userModel.login(req, res);
}

const getUsers = (req, res) => {
    const token = req.headers.authorization;
    const idUser = jwt.decodeToken(token).idUser;
    var genre = 'O';
    var orientation = 'BI';
    userAction.getUserById(idUser)
        .then(user => {
            if (user.rowCount == 0)
                return res.status(400).json({ code: 400, message: 'user don\'t existe' });
            // console.log("###############################", user.rows[0])
            if (!user.rows[0].active)
                return res.status(400).json({ code: 400, message: 'user not active' });
            console.log(user.rows[0].gender, user.rows[0].orientation)
            if (user.rows[0].gender == 'M' && user.rows[0].orientation == 'M') {
                genre = 'M';
                orientation = 'M'
            }
            else if (user.rows[0].gender == 'M' && user.rows[0].orientation == 'W') {
                genre = 'W';
                orientation = 'M'
            }
            else if (user.rows[0].gender == 'W' && user.rows[0].orientation == 'M') {
                genre = 'M';
                orientation = 'W'
            }
            else if (user.rows[0].gender == 'W' && user.rows[0].orientation == 'W') {
                genre = 'W';
                orientation = 'W'
            }
            else if (user.rows[0].gender == 'O' && user.rows[0].orientation == 'M') {
                genre = 'M';
                orientation = 'BI'
            }
            else if (user.rows[0].gender == 'O' && user.rows[0].orientation == 'W') {
                genre = 'W';
                orientation = 'BI'
            }
            else if (user.rows[0].orientation == 'BI') {
                genre = 'X';
                orientation = 'BI'
            }
            console.log(genre, orientation)
            userModel.getUsers(idUser, genre, orientation)
                .then(data => {
                    if (data.rowCount == 0)
                        return res.status(200).json({ code: 200, users: [] })

                    console.log(data.rows[0])
                    return res.status(200).json({ code: 200, users: data.rows })
                })
                .catch(err => { console.log(err) })
        })
        .catch(err => {
            console.log('err getUserById in userController getUsers', err)
            return res.status(400).json({ code: 400, message: 'Error intern' });
        })
}


const getUser = (req, res) => {
    const token = req.headers.authorization;
    const idUser = jwt.decodeToken(token).idUser;
    const id = htmlSpecialChars(req.params.id);
    userAction.getUserById(id)
        .then(data => {
            if (data.rowCount === 0)
                return res.status(400).json({ code: 400, message: 'User not found' })
            else
                return res.status(200).json({
                    code: 200, users: {
                        iduser: data.rows[0].iduser,
                        firstName: data.rows[0].firstname,
                        lastName: data.rows[0].lastname,
                        username: data.rows[0].username,
                        dateOfBirth: moment(data.rows[0].dateofbirth).format('YYYY-MM-DD'),
                        bio: entities.decode(data.rows[0].bio),
                        gender: data.rows[0].gender,
                        orientation: data.rows[0].orientation,
                        score: data.rows[0].score,
                        mail: data.rows[0].mail,
                        photo: data.rows[0].photos
                    },
                })

        })
        .catch(err => {
            console.log('get user error', err);
            return res.status(400).json({ code: 400, message: 'Invalid request' });
        })
}

module.exports = {
    userSignup,
    activateAccount,
    userLogin,
    getUsers,
    getUser,
}