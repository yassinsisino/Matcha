const bcrypt = require('bcrypt');
const uniqid = require('uniqid');

const pool = require('../database/index');

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

const AddNewUser = async (firstName, lastName, username, mail, password, activationKey, callback) => {
    const saltRound = 10;
    const passwordCrypt = await bcrypt.hash(password, saltRound).then(hash => hash).catch(err => console.log('error', err));
    const request = {
        name: 'Add new user',
        text: 'INSERT INTO users(firstname, lastname, username, mail, password, activationkey) VALUES($1, $2, $3, $4, $5, $6)',
        values: [firstName, lastName, username, mail, passwordCrypt, activationKey]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(res => callbacl(res, null))
}

module.exports = {
    activeAccountByActivationKey,
    getUserByMail,
    getUserByUsername,
    AddNewUser,
}