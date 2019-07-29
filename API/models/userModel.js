const util = require('util');
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const htmlSpecialChars = require('htmlspecialchars');

const pool = require('../database/index');
const mailer = require('../utils/mailer');
const jwt = require('../utils/jwt');

const regex_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const regex_username = /^[a-zA-Z0-9_.-]*$/;
const regex_name = /^[a-zA-Z_.-]*$/;
const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const saltRound = 10;

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
    const exist_mail = util.promisify(getUserByMail);
    const checkMail = await exist_mail(mail).then(result => result).catch(err => err);
    if (checkMail.name === 'error')
        return res.status(400).json({ code: 400, message: 'Invalid request' });
    else if (checkMail.rowCount !== 0)
        return res.status(400).json({ code: 400, message: 'Mail already exist' });
    const exist_username = util.promisify(getUserByUsername);
    const checkUsername = await exist_username(username).then(result => result).catch(err => err);
    if (checkUsername.name === 'error')
        return res.status(400).json({ code: 400, message: 'Invalid request' });
    else if (checkUsername.rowCount !== 0)
        return res.status(400).json({ code: 400, message: 'Usernamess already exist' });
    const passwordCrypt = await bcrypt.hash(password, saltRound).then(hash => hash).catch(err => console.log('error', err));
    const activationKey = uniqid(Date.now() + '-');
    const activationUrl = 'http://localhost:3000/api/user/active/' + activationKey;

    const request = {
        name: 'Add new user',
        text: 'INSERT INTO users(firstname, lastname, username, mail, password, activationkey) VALUES($1, $2, $3, $4, $5, $6)',
        values: [firstName, lastName, username, mail, passwordCrypt, activationKey]
    }
    const requestStatus = await pool.query(request).then(data => data).catch(err => err)
    if (requestStatus.name === 'error')
        return res.status(400).json({ code: 400, message: 'Invalid request' });
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
            if (deleteUser.rowCount == 1) {
                return res.status(400).json({ code: 400, message: 'Invalid request' });
            }
        }
        return res.status(201).json({ code: 201, message: 'user add successfully, please confirm your mail' });
    }

}

const activateAccount = async (req, res) => {
    const activeAccount = util.promisify(activeAccountByActivationKey);
    const activate = await activeAccount(req.params.activationKey).then(data => data).catch(err => err);
    if (activate.rowCount) {
        return res.status(200).json({ code: 200, message: 'your account is activated' });
    }
    else {
        return res.status(400).json({ code: 400, message: 'Invalid request' })
    }
}

const login = async (req, res) => {
    const mail = htmlSpecialChars(req.body.mail);
    const password = htmlSpecialChars(req.body.password);
    if (!mail || !password)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!mail.match(regex_mail) || (mail.length < 5 && mail.length > 60))
        return res.status(400).json({ code: 400, message: 'Invalid Mail' });
    else if (!password.match(regex_password) || password.length > 25)
        return res.status(400).json({ code: 400, message: 'Invalid Password' });
    const getUser = util.promisify(getUserByMail);
    const user = await getUser(mail).then(data => data).catch(err => err);
    const passwordMatch = await bcrypt.compare(password, user.password).catch(err => err)
    if (!passwordMatch)
        return res.status(400).json({ code: 400, message: 'Wrong password'});
    const getToken = util.promisify(jwt.getToken);
    const token = await getToken({ idUser: user.iduser, mailUser: user.mail}).then(data => data).catch(err => err);
    if (!token)
        return res.status(400).json({ code: 400, message: 'Error to connexion'});
    return res.status(200).json({ code: 200, message: 'Connexion success', token: token})
}
// 

const activeAccountByActivationKey = (activationKey, callback) => {
    const request = {
        name: 'active account by activation key',
        text: 'UPDATE users SET active = true WHERE activationkey = $1',
        values: [activationKey]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const getUserByMail = (mail, callback) => {

    const request = {
        name: 'get user by mail',
        text: 'SELECT * FROM users WHERE mail = $1',
        values: [mail]
    }
    pool.query(request)
        .then(res => callback(null, res.rows[0]))
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
    login,
}