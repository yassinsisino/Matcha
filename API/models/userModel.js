const util = require('util');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');

const pool = require('../database/index');
const mailer = require('../utils/mailer');

const addUser = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const mail = req.body.mail;
    const password = req.body.password;
    const saltRound = 10;

    const regex_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const regex_username = /^[a-zA-Z0-9_.-]*$/;
    const regex_name = /^[a-zA-Z_.-]*$/;
    const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;


    if (!firstName.match(regex_name) || (firstName.length < 2 && firstName.length > 20)) {
        return res.status(409).json({ code: 409, message: 'Invalid Firstname ' });
    }
    else if (!lastName.match(regex_name) || (lastName.length < 2 && lastName.length > 20)) {
        return res.status(409).json({ code: 409, message: 'Invalid Lastname' });
    }
    else if (!username.match(regex_username) || (username.length < 2 && username.length > 20)) {
        return res.status(409).json({ code: 409, message: 'Invalid Username' });
    }
    else if (!mail.match(regex_mail) || (mail.length < 5 && mail.length > 60)) {
        return res.status(409).json({ code: 409, message: 'Invalid Mail' });
    }
    else if (!password.match(regex_password) || password.length > 25) {
        return res.status(409).json({ code: 409, message: 'Invalid Password' });
    }
    const exist_mail = util.promisify(getUserByMail);
    const checkMail = await exist_mail(mail).then(result => result).catch(err => err);
    if (checkMail.name === 'error')
        return res.status(409).json({ code: 409, message: 'Invalid request' });
    else if (checkMail.rowCount !== 0)
        return res.status(409).json({ code: 409, message: 'Mail already exist' });
    const exist_username = util.promisify(getUserByUsername);
    const checkUsername = await exist_username(username).then(result => result).catch(err => err);
    if (checkUsername.name === 'error')
        return res.status(409).json({ code: 409, message: 'Invalid request' });
    else if (checkUsername.rowCount !== 0)
        return res.status(409).json({ code: 409, message: 'Usernamess already exist' });
    const passwordCrypt = await bcrypt.hash(password, saltRound).then(hash => hash).catch(err => console.log('error', err));
    const activationKey = uniqid(Date.now() + '-');
    const activationUrl = 'http://localhost:3000/api/user/active/?activationKey=' + activationKey;

    const request = {
        name: 'Add new user',
        text: 'INSERT INTO users(firstname, lastname, username, mail, password, activationkey) VALUES($1, $2, $3, $4, $5, $6)',
        values: [firstName, lastName, username, mail, passwordCrypt, activationKey]
    }
    const requestStatus = await pool.query(request).then(data => data).catch(err => err)
    if (requestStatus.name === 'error')
        return res.status(409).json({ code: 409, message: 'Invalid request' });
    else if (requestStatus.rowCount !== 0) {
        const mailler = util.promisify(mailer.sendInscriptionMail);
        const sendMail = await mailler(mail, activationUrl, username).then(data => data).catch(err => err);
        if (!sendMail.accepted) {
            const deleteRequest = {
                name: 'Delete user by mail',
                text: 'DELETE FROM users WHERE mail = $1',
                values: [mail]
            }
            const deleteUser = await pool.query(deleteRequest).then(data => data).catch(err => err);
            if (deleteUser.rowCount == 1){
                return res.status(409).json({ code: 409, message: 'Invalid request' });
            }
        }
        return res.status(201).json({ code: 201, message: 'user add successfully, please confirm your mail' });
    }

}

const activateAccount = (req, res) => {
    
}

const getUserByMail = (mail, callback) => {

    const request = {
        name: 'get user by mail',
        text: 'SELECT * FROM users WHERE mail = $1',
        values: [mail]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))

}

const getUserByUsername = (username, callback) => {
    const request = {
        name: 'get user by username',
        text: 'SELECT * FROM users WHERE username = $1',
        values: [username]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

module.exports = {
    addUser,
    activateAccount,
}