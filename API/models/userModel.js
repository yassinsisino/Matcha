const util = require('util');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const htmlSpecialChars = require('htmlspecialchars');
const moment = require('moment');
const Entities = require('html-entities').AllHtmlEntities;

const model = require('./userAction');
const mailer = require('../utils/mailer');
const jwt = require('../utils/jwt');
const tagModel = require('./tagModel');
const pool = require('../database/index');


const regex_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const regex_username = /^[a-zA-Z0-9_.-]*$/;
const regex_name = /^[a-zA-Z_.-]*$/;
const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;

const entities = new Entities();

// #########################################
// add new user:
//  1- check input data (empty, htmlspecialchars,..)
//  2- check if mail or username does existe
//  3- add user in databases and send confirmation mail
// #########################################

const addUser = async (req, res) => {
    const firstName = htmlSpecialChars(req.body.firstName);
    const lastName = htmlSpecialChars(req.body.lastName);
    const username = htmlSpecialChars(req.body.username);
    const mail = htmlSpecialChars(req.body.mail);
    const password = htmlSpecialChars(req.body.password);

    if (!firstName || !lastName || !username || !mail || !password)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!firstName.match(regex_name) || (firstName.length < 2 && firstName.length > 20)) {
        return res.status(400).json({ code: 400, message: 'Invalid Firstname ' });
    }
    else if (!lastName.match(regex_name) || (lastName.length < 2 && lastName.length > 20)) {
        return res.status(400).json({ code: 400, message: 'Invalid Lastname' });
    }
    else if (!username.match(regex_username) || (username.length < 2 && username.length > 20)) {
        return res.status(400).json({ code: 400, message: 'Invalid Username' });
    }
    else if (!mail.match(regex_mail) || (mail.length < 5 && mail.length > 60)) {
        return res.status(400).json({ code: 400, message: 'Invalid Mail' });
    }
    else if (!password.match(regex_password) || password.length > 25) {
        return res.status(400).json({ code: 400, message: 'Invalid Password' });
    }
    model.getUserByMail(mail)
        .then(async (data) => {
            if (data.rowCount !== 0)
                return res.status(400).json({ code: 400, message: 'Mail already exist' });
            const exist_username = util.promisify(model.getUserByUsername);
            const checkUsername = await exist_username(username).then(result => result).catch(err => err);
            if (checkUsername && checkUsername.name === 'error')
                return res.status(400).json({ code: 400, message: 'Invalid request' });
            else if (checkUsername && checkUsername.rowCount !== 0)
                return res.status(400).json({ code: 400, message: 'Usernames already exist' });
            const activationKey = uniqid(Date.now() + '-');
            const activationUrl = 'http://localhost:3000/api/user/activation/' + activationKey;
            const photos = {profil: 'img1', img1: '', img2: '', img3: '', img4: '', img5: ''};
            // add user
            const adduser = util.promisify(model.addNewUser);

            const requestStatus = await adduser(firstName, lastName, username, mail, password, activationKey, photos).then(data => data).catch(err => err)
            if (requestStatus.name === 'error')
                return res.status(400).json({ code: 400, message: 'Invalid request' });
            else if (requestStatus.rowCount !== 0) {
                // send mail
                const mailler = util.promisify(mailer.sendInscriptionMail);
                const sendMail = await mailler(mail, activationUrl, username).then(data => data).catch(err => err);
                if (!sendMail.accepted) {
                    const deleteRequest = util.promisify(model.deleteUserByMail);
                    const deleteUser = await deleteRequest(mail).then(data => data).catch(err => err);
                    if (deleteUser.rowCount == 1) {
                        return res.status(400).json({ code: 400, message: 'Invalid request mail not send' });
                    }
                }
                return res.status(201).json({ code: 201, message: 'user add successfully, please confirm your mail' });
            }
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ code: 400, message: 'Invalid request' });
        })
}

// #########################################
// activate user account
// #########################################

const activateAccount = async (req, res) => {
    const activeAccount = util.promisify(model.activeAccountByActivationKey);
    const activate = await activeAccount(req.params.activationKey).then(data => data).catch(err => err);
    if (activate.rowCount) {
        // return res.status(200).json({ code: 200, message: 'your account is activated' });
        return res.redirect('http://localhost:3001/connexion/' + req.params.activationKey);
    }
    else {
        return res.status(400).json({ code: 400, message: 'Invalid request' })
    }
}

// #########################################
// Login user use token to authentification
// #########################################

const login = async (req, res) => {
    const mail = htmlSpecialChars(req.body.mail);
    const password = htmlSpecialChars(req.body.password);
    if (!mail || !password)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!mail.match(regex_mail) || (mail.length < 5 && mail.length > 60))
        return res.status(400).json({ code: 400, message: 'Invalid Mail' });
    else if (!password.match(regex_password) || password.length > 25)
        return res.status(400).json({ code: 400, message: 'Invalid Password' });
    model.getUserByMail(mail)
        .then(user => {
            if (user.rowCount == 0)
                return res.status(400).json({ code: 400, message: 'Wrong Mail' });
            bcrypt.compare(password, user.rows[0].password)
                .then(async (data) => {
                    if (!data)
                        return res.status(400).json({ code: 400, message: 'Wrong password' });
                    if (!user.rows[0].active)
                        return res.status(400).json({ code: 400, message: 'compte not activeted yet' });
                    const getToken = util.promisify(jwt.getToken);
                    const token = await getToken({ idUser: user.rows[0].iduser, username: user.rows[0].username }).then(data => data).catch(err => err);
                    if (!token)
                        return res.status(400).json({ code: 400, message: 'Error to connexion' });

                    // Get user tag list 
                    const getTags = util.promisify(tagModel.getUserTags);
                    const tags = await getTags(user.iduser);
                    return res.status(200).json({
                        code: 200,
                        message: 'Connexion success',
                        firstName: user.rows[0].firstname,
                        lastName: user.rows[0].lastname,
                        username: user.rows[0].username,
                        bio: entities.decode(user.rows[0].bio),
                        gender: user.rows[0].gender,
                        dateOfBirth: moment(user.rows[0].dateofbirth).format('YYYY-MM-DD'),
                        orientation: user.rows[0].orientation,
                        mailNotification: user.rows[0].mailNotification,
                        mail: user.rows[0].mail,
                        photos: user.rows[0].photos,
                        tags: tags,
                        token: token,
                        userId: user.rows[0].iduser
                    })

                })
                .catch(err => {
                    console.log('erreur  bcrypt compare ', err)
                    return res.status(400).json({ code: 400, message: 'Error to connexion' });
                })
        })
        .catch(err => {
            console.log('erreur catch get user by email\n', err)
            return res.status(400).json({ code: 400, message: 'Error to connexion' });
        })
}


// #########################################
// get list of users recomanded for you
// #########################################

const getUsers = (idUser, genre, orientation) => {
    if (genre != 'X')
        var request = {
            name: 'get users',
            text: 'SELECT iduser, firstname, lastname, username, dateofbirth, bio, gender, orientation, score  \
                    FROM users  WHERE iduser != $1 AND gender = $2 AND orientation = $3',
            values: [idUser, genre, orientation]
        }
    else
        var request = {
            name: 'get users',
            text: 'SELECT iduser, firstname, lastname, username, dateofbirth, bio, gender, orientation, score  \
                    FROM users  WHERE iduser != $1 AND orientation = $2',
            values: [idUser, orientation]
        }

    return pool.query(request)
}

// #########################################
// #########################################

module.exports = {
    addUser,
    activateAccount,
    login,
    getUsers,
}