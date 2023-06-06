const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users')

router.route('/register')
    .get(users.showRegisterForm)
    .post(validateUser, catchAsync(users.createUser));

router.route('/login')
    .get(users.showLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.loginUser)

router.get('/logout', users.logout);

router.route('/resetPassword')
    .get(users.showResetPasswordForm)
    .post(catchAsync(users.resetPassword));

router.route('/newPassword/:id/:token')
    .get(catchAsync (users.showNewPasswordForm))
    .post(catchAsync (users.submitNewPassword));

module.exports = router