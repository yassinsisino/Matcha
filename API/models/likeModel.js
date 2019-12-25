const pool = require ('../database/index');
const jwt = require ('../utils/jwt');
const htmlspecialchars = require('htmlspecialchars')

const isLiked = (idUser, idUserLiked) => {
    const request = {
        name: 'is user liked',
        text: 'SELECT * FROM likes WHERE iduser = $1 AND likediduser = $2',
        values: [idUser, idUserLiked]
    }
    return pool.query(request);
}

const likeUser = (idUser, idUserLiked) => {
    const request = {
        name: 'like user',
        text: 'INSERT INTO likes (iduser, likediduser) VALUES ($1, $2)',
        values: [idUser, idUserLiked]
    }
    return pool.query(request);
}

const unlikeUser = (idUser, idUserLiked) => {
    const request = {
        name: 'unlike user',
        text: 'DELETE FROM likes WHERE iduser = $1 AND likediduser = $2',
        values: [idUser, idUserLiked]
    }
    return pool.query(request)
}

module.exports = {
    isLiked,
    likeUser,
    unlikeUser,
}