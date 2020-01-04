const bcrypt = require('bcrypt');

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

const getUserByMail = (mail) => {

    const request = {
        name: 'get user by mail',
        text: 'SELECT * FROM users WHERE mail = $1',
        values: [mail]
    }
    return pool.query(request)
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

const addNewUser = async (firstName, lastName, username, mail, password, activationKey, callback) => {
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

const deleteUserByMail =  (mail, callback) => {
    const request = {
        name: 'Delete user by mail',
        text: 'DELETE FROM users WHERE mail = $1',
        values: [mail]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(res => callback(res, null))
}

const updateUsername = (iduser, username, callback) => {
    const request = {
        name: 'Update username',
        text: 'UPDATE users SET username = $1 WHERE iduser = $2',
        values: [username, iduser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const updateFirstname  = (idUser, firstname, callback) => {
    const request = {
        name: 'update firstname',
        text: 'UPDATE users SET firstname = $1 WHERE iduser = $2',
        values: [firstname, idUser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const updateLastname  = (idUser, lastname, callback) => {
    const request = {
        name: 'update lastname',
        text: 'UPDATE users SET lastname = $1 WHERE iduser = $2',
        values: [lastname, idUser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const updateDateOfBirth = (idUser, dateOfBirth, callback) => {
    const request = {
        name: 'update date of birth',
        text: 'UPDATE users SET dateofbirth = $1 WHERE iduser = $2',
        values: [dateOfBirth, idUser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const updateBio = (idUser, bio, callback) => {
    const request = {
        name: 'update biography',
        text: 'UPDATE users SET bio = $1 WHERE iduser = $2',
        values: [bio, idUser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}

const updateGender = (idUser, gender, callback) => {
    const request ={
        name: 'update gender',
        text: 'UPDATE users SET gender = $1 WHERE iduser = $2',
        values: [gender, idUser]
    }
    pool.query(request)
        .then(res => callback(null, res))
        .catch(err => callback(err, null))
}


module.exports = {
    activeAccountByActivationKey,
    getUserByMail,
    getUserByUsername,
    addNewUser,
    deleteUserByMail,
    updateUsername,
    updateFirstname,
    updateLastname,
    updateDateOfBirth,
    updateBio,
    updateGender,
}