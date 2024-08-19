const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../Utils/catchAsync');

const { storeReturnTo } = require('../middleware');
const users = require('../controllers/user');

router.get('/register', users.renderRegForm);

//req.login is a method from passport which automatically logs in
router.post('/register', catchAsync(users.createNewUser));

router.get('/login', users.renderLoginForm);

//passport.authenticate is a passport middleware 
router.post('/login',
    //using the storeReturnTo middleware to save the returnTo value from session to res.locals
     storeReturnTo, 
     //passport.auhtenticate logs the user in and clears the req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.Login);

router.get('/logout', users.Logout);

module.exports = router;
