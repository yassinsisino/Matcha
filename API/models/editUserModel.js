const jwt = require('../utils/jwt');
const htmlSpecialChars = require('htmlspecialchars');
const util = require('util');
const model = require('./userAction');


const regex_username = /^[a-zA-Z0-9_.-]*$/;
const regex_name = /^[a-zA-Z_.-]*$/;


const editUsername = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    // console.log(decode);
    const idUser = decode.idUser;
    const newUsername =  htmlSpecialChars(req.body.username);
    const getUserByUsername = util.promisify(model.getUserByUsername)
    const findUser = await getUserByUsername(newUsername).then(data => data).catch(err => err);
    if (newUsername == undefined)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty'})
    else if (!newUsername.match(regex_username) || (newUsername.length < 2 && newUsername.length > 20))
        return res.status(400).json({ code: 400, message: 'Invalid username' });
    else if (findUser.name === 'error')
        return res.status(400).json({ code: 400, message: 'Invalid request' });
    else if (findUser.rowCount !== 0)
        return res.status(400).json({ code: 400, message: 'Usernamess already exist' });
    const updateUsername = util.promisify(model.updateUsername)
    const update = await updateUsername(idUser, newUsername).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Username not updated'})
    return res.status(200).json({ code: 200, message: 'Username updated'})
}

const editFirstname = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const newFirstname = htmlSpecialChars(req.body.firstname);

    if (newFirstname == undefined || !newFirstname)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty'});
    else if (!newFirstname.match(regex_name) || (newFirstname.length < 2 && newFirstname.length > 20))
        return res.status(400).json({ code: 400, message: 'Invalide firstname'})
    const updateFirstname = util.promisify(model.updateFirstname);
    const update = await updateFirstname(idUser, newFirstname).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Firstname not updated'})
    return res.status(200).json({ code:200 , message: 'Firstname updated'})
}

const editLastname = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const newLastname = htmlSpecialChars(req.body.lastname);

    if (newLastname == undefined || !newLastname)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty'});
    else if (!newLastname.match(regex_name) || newLastname.length < 2 || newLastname.length > 20)
        return res.status(400).json({ code: 400, message: 'Invalide lastname'})
    const updateLastname = util.promisify(model.updateLastname);
    const update = await updateLastname(idUser, newLastname).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Lastname not updated'})
    return res.status(200).json({ code:200 , message: 'Lastname updated'})
}

const editBirthDate = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const dateOfBirth = htmlSpecialChars(req.body.dateOfBirth);
}


module.exports = {
    editUsername,
    editFirstname,
    editLastname,
    editBirthDate,
}