const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Token = require('../models/token');
const User = require('../models/user')
const {setMailOptions, sendEmail} = require('../utils/email');

module.exports.showRegisterForm = (req, res) => {
    res.render('users/register')
};

module.exports.createUser = async (req,res) => {
    try{
        const {username, password} = req.body
        const user = new User({username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'You have been successfully registered.')
            const email = setMailOptions('sigeti.juraj@gmail.com', `Succesfull Registration for ${registeredUser.username}`, `${registeredUser.username} has been registered to excel automation website. Please adjust his access on http://localhost:3000/admin/userManagement`)
            sendEmail(email);
            res.redirect('/invoices')
        });
        
    } 
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}; 

module.exports.showLoginForm = (req, res) => {
    res.render('users/login')
};

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = res.locals.returnTo || '/invoices'
    res.redirect(redirectUrl)
}

module.exports.logout =  (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    req.flash('success', 'You have been logged out')
    res.redirect('/login')
    });
};

module.exports.showResetPasswordForm = (req, res) => {
    res.render('users/resetPassword')
}

module.exports.resetPassword = async (req, res) => {
    try{
        const {username} = req.body;
        const user = await User.findOne({username: username});
        let token = await Token.findOne({userId: user._id});
    
        if(token){
            await token.deleteOne()
        }
    
        let resetToken = crypto.randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, Number(process.env.HASH_NUMBER));
    
        const newToken = await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save()
    
        const link = `http://localhost:3000/newPassword/${user._id}/${resetToken}`
    
        const mailOptions = setMailOptions(username, 'Reset your password.', `<p>Your password process has been initiated. Please click on the link below in order to finish the password reset.</p> <p>Ignore the email if you haven't initiated the password reset process</p> <br></br><a href="${link}">${link}</a>` )
        sendEmail(mailOptions)
        req.flash('success', 'Please check your email in order to continue.')
        res.redirect('/login')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
}

module.exports.showNewPasswordForm = async (req,res) => {
    const{id, token} = req.params

    const passwordResetToken = await Token.findOne({userId:id})
    if(!passwordResetToken){
        req.flash('error', 'Your link is invalid or it has expired.')
        res.redirect('/login')
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token)
    if(!isValid){
        req.flash('error', 'Your link is invalid or it has expired.')
        res.redirect('/login')
    }

    res.render('users/newPassword',{id, token})
};

module.exports.submitNewPassword = async(req,res) => {
    try{
        const {id} = req.params
        const user = await User.findById(id)
        await user.setPassword(req.body.password);
        await user.save();
        await Token.findOneAndDelete({userId:id})
        req.flash('success', 'You have successfully changed your password.')
        res.redirect('/login')
    }
    catch{
        req.flash('error', `Hups, something went wrong. Please contact admin at webdev.jusi@gmail.com`)
        res.redirect('/admin')
    }
}