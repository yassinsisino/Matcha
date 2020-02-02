const jwt = require('../utils/jwt');
const htmlSpecialChars = require('htmlspecialchars');
const util = require('util');
const model = require('./userAction');


const regex_username = /^[a-zA-Z0-9_.-]*$/;
const regex_name = /^[a-zA-Z_.-]*$/;
const regex_date = /^[0-9]{4}[-](([0]?[1-9])|([1][0-2]))[-](([0]?[1-9])|([1-2][0-9])|([3][0-1]))$/;
const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const regex_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


const editUsername = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    // console.log(decode);
    const idUser = decode.idUser;
    const newUsername = htmlSpecialChars(req.body.username);
    const getUserByUsername = util.promisify(model.getUserByUsername);
    const findUser = await getUserByUsername(newUsername).then(data => data).catch(err => err);
    if (newUsername == undefined)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!newUsername.match(regex_username) || (newUsername.length < 2 && newUsername.length > 20))
        return res.status(400).json({ code: 400, message: 'Invalid username' });
    else if (findUser.name === 'error')
        return res.status(400).json({ code: 400, message: 'Invalid request' });
    else if (findUser.rowCount !== 0)
        return res.status(400).json({ code: 400, message: 'Usernamess already exist' });
    const updateUsername = util.promisify(model.updateUsername)
    const update = await updateUsername(idUser, newUsername).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Username not updated' });
    return res.status(200).json({ code: 200, message: 'Username updated' });
}

const editFirstname = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const newFirstname = htmlSpecialChars(req.body.firstname);

    if (newFirstname == undefined || !newFirstname)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!newFirstname.match(regex_name) || (newFirstname.length < 2 && newFirstname.length > 20))
        return res.status(400).json({ code: 400, message: 'Invalide firstname' })
    const updateFirstname = util.promisify(model.updateFirstname);
    const update = await updateFirstname(idUser, newFirstname).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Firstname not updated' })
    return res.status(200).json({ code: 200, message: 'Firstname updated' })
}

const editLastname = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const newLastname = htmlSpecialChars(req.body.lastname);

    if (newLastname == undefined || !newLastname)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!newLastname.match(regex_name) || newLastname.length < 2 || newLastname.length > 20)
        return res.status(400).json({ code: 400, message: 'Invalide lastname' });
    const updateLastname = util.promisify(model.updateLastname);
    const update = await updateLastname(idUser, newLastname).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Lastname not updated' });
    return res.status(200).json({ code: 200, message: 'Lastname updated' });
}
const calculeAge = (birthDate) => {
    const today = new Date()
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();
    const dateOfBirth = birthDate.split('-');
    const year = dateOfBirth[0];
    const month = dateOfBirth[1];
    const date = dateOfBirth[2];
    let age = todayYear - year;
    if (todayMonth < month || (todayMonth == month && todayDate < date))
        age--;
    return (age);
}

const editBirthDate = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const dateOfBirth = htmlSpecialChars(req.body.dateOfBirth);
    if (dateOfBirth == undefined || !dateOfBirth)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!dateOfBirth.match(regex_date))
        return res.status(400).json({ code: 400, message: 'Invalide date' });
    const age = calculeAge(dateOfBirth);
    if (age < 0)
        return res.status(400).json({ code: 400, message: 'Invalide date' });
    else if (age < 18)
        return res.status(400).json({ code: 400, message: 'Site prohibited to the minor' });
    const updateDateOfBirth = util.promisify(model.updateDateOfBirth);
    const update = await updateDateOfBirth(idUser, dateOfBirth).then(data => data).catch(err => err);
    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Date of birth not updated' });
    return res.status(200).json({ code: 200, message: 'Date of birth updated' });
}

const editBio = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const bio = htmlSpecialChars(req.body.bio).trim();
    if (!bio || bio == undefined)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (bio.length < 20 || bio.length > 450)
        return res.status(400).json({ code: 400, message: 'Invalide bio, the biography must contain between 20 and 450 characters' });
    const updateBio = util.promisify(model.updateBio);
    //util.promisify -> Prend une fonction suivant le style de rappel commun d'erreur d'abord, c'est-à-dire en prenant un (err, value) => ...rappel comme dernier argument, et retourne une version qui renvoie des promesses.
    //a verifier si verif du meme firsname
    const update = await updateBio(idUser, bio).then(data => data).catch(err => err);
    // apres MAJ on verifie si prenom dispo dans BDD -> si ok =1 si no = 0.

    if (update.rowCount == 0)
        return res.status(400).json({ code: 400, message: 'Biography not updated' });
    return res.status(200).json({ code: 200, message: 'Biography updated' });
}

const editGender = async (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const gender = htmlSpecialChars(req.body.gender).toUpperCase();
    if (gender == undefined || !gender)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!(gender == 'W' || gender == "M" || gender == 'O'))
        return res.status(400).json({ code: 400, message: 'Invalide gender' });
    const updateGender = util.promisify(model.updateGender);
    const update = await updateGender(idUser, gender);
    console.log(update.rowCount);

}

const editPassword = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const password = htmlSpecialChars(req.body.password)
    if (!password.match(regex_password) || password.length > 25) {
        return res.status(400).json({ code: 400, message: 'Invalid Password' });
    }
    model.updatePassword(idUser, password)
        .then(data => {
            if (data.rowCount !== 0)
                return res.status(201).json({ code: 201, message: 'password updated' })
            else
                return res.status(400).json({ code: 400, message: 'password not updated' })
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json({ code: 400, message: 'Invalid request' });
        })
}

const editOrientation = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const orientation = htmlSpecialChars(req.body.orientation).toUpperCase();
    if (orientation === undefined || !orientation)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!(orientation == 'BI' || orientation == 'M' || orientation == 'W'))
        return res.status(400).json({ code: 400, message: 'Invalide orientation' });
    model.updateOrientation(idUser, orientation)
        .then(data => {
            if (data.rowCount !== 0)
                return res.status(201).json({ code: 201, message: 'Orientation updated' })
            else
                return res.status(400).json({ code: 400, message: 'Orientation not updated' })
        })
        .catch(err => {
            console.log('edit orientation error', err)
            return res.status(400).json({ code: 400, message: 'Invalid request' });
        })
}

const editMail = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const mail = htmlSpecialChars(req.body.mail)
    if (mail === undefined || !mail)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (!mail.match(regex_mail) || (mail.length < 5 && mail.length > 60))
        return res.status(400).json({ code: 400, message: 'Invalid Mail' });
    model.getUserByMail(mail)
        .then(data => {
            if (data.rowCount !== 0 && data.rows[0].iduser !== idUser)
                return res.status(400).json({ code: 400, message: 'Mail already exist' });
            else
                model.updateMail(idUser, mail)
                    .then(data => {
                        if (data.rowCount !== 0)
                            return res.status(201).json({ code: 201, message: 'Mail updated' })
                        else
                            return res.status(400).json({ code: 400, message: 'Mail not updated' })
                    })
                    .catch(err => {
                        return res.status(400).json({ code: 400, message: 'Invalid request' });
                    })
        })
        .catch(err => {
            console.log('edit mail error', err)
            return res.status(400).json({ code: 400, message: 'Invalid request' });
        })
}

const editPhotos = (req, res) => {
    const token = req.headers.authorization;
    const decode = jwt.decodeToken(token);
    const idUser = decode.idUser;
    const photos = req.body.photos
    if (photos === undefined || !photos)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else {
        try {
            JSON.parse(photos)
        }
        catch (e) {
            return res.status(400).json({ code: 400, message: 'Bad input format we need JSON object' });
        }
    }
    const obj = JSON.parse(photos)
    if (Object.keys(obj).length !== 6) {
        return res.status(400).json({ code: 400, message: 'Bad input format' });
    }
    else if (obj.profil && (obj.profil === 'img1' || obj.profil === 'img2' || obj.profil === 'img3' || obj.profil === 'img4' || obj.profil === 'img5')) {
        model.updatePhotos(idUser, obj)
            .then(data => {
                if (data.rowCount !== 0)
                    return res.status(201).json({ code: 201, message: 'Photos updated' })
                else
                    return res.status(400).json({ code: 400, message: 'Photos not updated' })
            })
            .catch(err => {
                return res.status(400).json({ code: 400, message: 'Invalid request' });
            })
    }
    else
        return res.status(400).json({ code: 400, message: 'Bad input format' });
}

module.exports = {
    editUsername,
    editFirstname,
    editLastname,
    editBirthDate,
    editBio,
    editGender,
    editPassword,
    editOrientation,
    editMail,
    editPhotos,
}