const tagModel = require('../models/tagModel');

const addUserTag = (req, res) => {
    tagModel.addTags(req, res)
}

const deleteUserTag = (req, res) => {
    tagModel.deleteUserTag(req, res)
}

module.exports = {
    addUserTag,
    deleteUserTag,
}