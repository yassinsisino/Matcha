const pool = require('../database/index')

const addMatch = (idUser1, idUser2) => {
    const request = {
        name: 'match two user',
        text: 'INSERT INTO matches (iduser1, iduser2) VALUES ($1, $2)',
        values: [idUser1, idUser2]
    }
    return pool.query(request);
}

const isMatched = (idUser1, idUser2) => {
    const request = {
        name: 'is users matched',
        text: 'SELECT * FROM matches WHERE (iduser1 = $1 AND iduser2 = $2) OR (iduser1 = $2 AND iduser2 = $1)',
        values: [idUser1, idUser2]
    }
    return pool.query(request);
}

const deleteMatch = (idMatch) => {
    const request = {
        name: 'delete match with idmatch',
        text: 'DELETE FROM matches WHERE idmatch = $1 ',
        values: [idMatch]
    }
    return pool.query(request);ß
}

const getMatch = (idUser) => {
    const request = {
        name: 'get all user like',
        text: 'SELECT users.iduser, firstname, lastname, username, bio, dateofbirth \
                FROM users, matches \
                WHERE (matches.iduser1 = $1 and matches.iduser2 = users.iduser) OR (matches.iduser2 = $1 and matches.iduser1 = users.iduser)',
        values: [idUser],
    }
    return pool.query(request)
}

module.exports = {
    addMatch,
    isMatched,
    deleteMatch,
    getMatch,
}