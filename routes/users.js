var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var dateFormat = require('dateformat');
var now = new Date();

/ Register
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var city = req.body.city;
    var state = req.body.state;
    var picture = req.body.picture;
    var isadmin = req.body.isadmin;

    // Validation
    req.checkBody('username', 'Email is required').notEmpty();
    req.checkBody('username', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    f(errors){
        res.render('register',{
            errors:errors
        });
    } else {
        var newUser = new User({
            email:email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
})

router.get('/login', function (req, res) {
    res.render('login')
})

module.exports = router;
