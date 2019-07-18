const userModel = require('../models/userModel');

exports.userSignup = async (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const mail = req.body.mail
    const password = req.body.password;

    const regex_mail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const regex_userName = /^[a-zA-Z0-9_.-]*$/;
    const regex_name = /^[a-zA-Z_.-]*$/;
    const regex_password = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;

    
    if (!firstName.match(regex_name) || (firstName.length  < 2  && firstName.length > 20))
    {
        return res.status(409).json({code:409, message:'Invalid Firstname '});
    }
    else if (!lastName.match(regex_name) || (lastName.length < 2  && lastName.length > 20))
    {
        return res.status(409).json({message: 'Invalid Lastname'});
    }
    else if (!userName.match(regex_userName) || (userName.length < 2  && userName.length > 20))
    {
        return res.status(409).json({message: 'Invalid Username'});
    }
    else if (!mail.match(regex_mail) || (mail.length < 5  && mail.length > 60))
    {
        return res.status(409).json({message: 'Invalid Mail'});        
    }
    else if (!password.match(regex_password) || password.length > 25)
    {
        return res.status(409).json({message: 'Invalid Password'});        
    }
    const exist_mail = await userModel.getUserByMail(req)
    console.log(exist_mail);
    
    
        
};
