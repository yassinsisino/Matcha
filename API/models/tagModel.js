const pool = require('../database/index');
const jwt = require('../utils/jwt');
const htmlSpecialChars = require('htmlspecialchars');


const addTags = (req, res) => {
    const token = req.headers.authorization;
    const idUser = jwt.decodeToken(token).idUser;
    const tag = htmlSpecialChars(req.body.tag).trim();
    if (!tag)
        return res.status(400).json({ code: 400, message: 'Bad request, some input are empty' });
    else if (tag.length < 2 || tag.length > 20)
        return res.status(400).json({ code: 400, message: 'Invalid tag length' });
    const request = {
        name: 'Add new tag to user',
        text: 'INSERT INTO tags (tag, iduser) VALUES($1, $2)',
        values: [tag, idUser]
    };
    pool.query(request)
        .then( result => {
            return res.status(201).json({ code: 201, message: 'Tag add successfully to user'})
        })
        .catch(err => {
            console.log('Error add tag to user ', err)
            return res.status(400).json({ code: 400, message: 'Sorry We can not add the tag'})
        });

}

const getUserTags = (idUser, callback) => {
    let tags = [];
    const request = {
        name: 'Get user tag list',
        text: 'SELECT tag FROM tags WHERE iduser = $1',
        values: [idUser]
    }
    pool.query(request)
    .then(result => {
        if (result.rowCount > 0){
            result.rows.forEach((tag) => {
                tags.push(tag.tag)
            })
        }
        return callback(null, tags);
    })
    .catch(err =>{
        console.log('error get user tags', err)
        return callback(tags, null);
    });
}

const deleteUserTag = (req, res) =>{
    const token = req.headers.authorization;
    const idUser = jwt.decodeToken(token).idUser;
    const tag = htmlSpecialChars(req.body.tag).trim();
    const request = {
        name: 'Delete user tag',
        text: 'DELETE FROM tags WHERE tag = $1 AND idUser = $2',
        values: [tag, idUser]
    }
    pool.query(request)
    .then(result => {
        console.log('suppression de tag user ', result)
        return res.status(201).json({ code: 201, message: 'delete tag successfully'})
    })
    .catch(err => {
        console.log('error delete tag user', err)
        return res.status(400).json({ code: 400, message: 'Sorry We can not delete the tag'})
    })
}

module.exports = {
    addTags,
    getUserTags,
    deleteUserTag,
}