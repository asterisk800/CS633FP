var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('../models/users')
var now = new Date();

// Register
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
    connection.addNewUser(username,password,dob,gender,city,state);
    res.redirect('/users/login');

});

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/enter', function (req, res) {
    res.render('enter')
})

module.exports = router;
