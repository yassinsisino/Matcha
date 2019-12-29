const likeModel = require('../models/likeModel');
const jwt = require('../utils/jwt');
const htmlspecialchars = require('htmlspecialchars')
const matchModel = require('../models/matchModel')

const likeUser = (req, res) => {
    const idUser = jwt.decodeToken(req.headers.authorization).idUser;
    const idUserLiked = htmlspecialchars(req.body.iduser).trim();
    if (idUserLiked != idUser) {
        likeModel.isLiked(idUser, idUserLiked)
            .then(data => {
                if (data.rowCount == 0) {
                    likeModel.likeUser(idUser, idUserLiked)
                        .then(data => {
                            // console.log("############# likeUser then", data)
                            console.log("############# likeUser then")
                            likeModel.isLiked(idUserLiked, idUser)
                                .then(data => {
                                    if (data.rowCount > 0) {
                                        matchModel.addMatch(idUser, idUserLiked)
                                            .then(data => console.log('add new match after like'))
                                            .catch(err => console.log('error add match in function likeUser', err))
                                    }
                                })
                            return res.status(201).json({ code: 201, message: 'the user is correctly liked' })
                        })
                        .catch(err => {
                            console.log("############# likeUser catch", err)
                            return res.status(400).json({ code: 400, message: 'the user cannot be liked' })
                        })
                }
                else {
                    return res.status(400).json({ code: 400, message: 'the user is already liked' })
                }
            })
            .catch(err => {
                console.log('isLiked function in likeUser catch error', err)
                return res.status(400).json({ code: 400, message: 'Fail to like user try again' })
            })
    }
    else
        return res.status(400).json({ code: 400, message: 'You cannot like your self' })
}

const unlikeUser = (req, res) => {
    const idUser = jwt.decodeToken(req.headers.authorization).idUser;
    const idUserLiked = htmlspecialchars(req.body.iduser).trim();
    if (idUserLiked != idUser) {
        likeModel.isLiked(idUser, idUserLiked)
            .then(data => {
                // console.log(data)
                if (data.rowCount > 0) {
                    likeModel.unlikeUser(idUser, idUserLiked)
                        .then(data => {
                            // console.log("############# unlikeUser then", data)
                            console.log("############# unlikeUser then")
                            matchModel.isMatched(idUser, idUserLiked)
                                .then(data => {
                                    if (data.rowCount > 0) {
                                        console.log('isMatched function resultat', data.rows[0].idmatch)
                                        matchModel.deleteMatch(data.rows[0].idmatch)
                                            .then(data => console.log('Match correctly deleted'))
                                            .catch(err => console.log('error delete match in unlikeUser function', err))
                                    }
                                })
                            return res.status(201).json({ code: 201, message: 'the user is correctly unliked' })
                        })
                        .catch(err => {
                            console.log("############# unlikeUser catch", err)
                            return res.status(400).json({ code: 400, message: 'the user cannot be unliked' })
                        })
                }
                else {
                    // console.log(data)
                    return res.status(400).json({ code: 400, message: 'the user is already unliked' })
                }

            })
            .catch(err => {
                console.log('isLiked function in unlikeUser catch error', err)
                return res.status(400).json({ code: 400, message: 'Fail to unlike user try again' })
            })
    }
    else
        return res.status(400).json({ code: 400, message: 'You cannot unlike your self' })
}

const getLike = (req, res) => {
    const idUser = jwt.decodeToken(req.headers.authorization).idUser;
    likeModel.getLike(idUser)
    .then (data => {
        console.log(data)
    })
    .catch (err => {
        console.log(err)
    })
}

module.exports = {
    likeUser,
    unlikeUser,
    getLike,
}