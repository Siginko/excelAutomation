const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
});

function setMailOptions(to, subject, html) {
    const mailOptions = {
    from: process.env.USER,
    to: to,
    subject: subject, 
    html: html
}
    return mailOptions
}

function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions)
}

module.exports = {setMailOptions, sendEmail}