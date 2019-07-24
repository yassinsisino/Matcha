const nodemailer = require('nodemailer');


const sendInscriptionMail = (destinationMail, activationUrl, username, callback) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: '4matcha2@gmail.com',
            pass: '42Matcha2019',
        }
    });

    const mailOptions = {
        from: '4matcha2@gmail.com',
        to: destinationMail,
        subject: 'Confirmation mail',
        html: '<h2>Confirmation de l\'adress mail</h2>'+
                '<p>Bonjour '+username+',</p>'+
                '<p>Merci d\'avoir choisi matcha veillez confirmer votre mail</p>'+
                '<p><a href='+activationUrl+'>Confirmation mail</a></p>',
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            callback(err, null);
        else if (info)
            callback(null, info)
    })
}

module.exports = {
    sendInscriptionMail,
}