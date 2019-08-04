const editUserModel = require('../models/editUserModel');

const editUsername = (req, res) => {
    editUserModel.editUsername(req, res);
    
}

module.exports = {
    editUsername,
}
