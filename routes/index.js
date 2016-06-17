// app/routes.js
var mysql = require('mysql');
var dbconfig = require('../config/db');
var connection = mysql.createConnection(dbconfig.connection);
var users = require('../models/users');


module.exports = function(app, passport) {



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('login', {title: 'Login'}); // load the index.ejs file
    });

    app.get('/features', function(req, res) {
        res.render('features.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'Features'
        }); // load the index.ejs file
    });

    app.get('/about-us', function(req, res) {
        res.render('about-us.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'About Us'
        }); // load the index.ejs file
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage'),  title: 'Login' });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/register', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('register.ejs', { message: req.flash('signupMessage'), title: 'Register' });
    });

    // process the signup form
    app.post('/register', passport.authenticate('local-register', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'User Profile'
        });
    });
    app.get('/enter', isLoggedIn, function (req, res) {
        res.render('enter.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'Enter Consumption'
        });
    });

    app.post('/enter', isLoggedIn, function(req, res){
        var userId = req.user.userID;
        if(userId) {
            var date = req.body.date || null;
            var beverage = req.body.drinkBrand.bevID || null;
            var rating = req.body.rating || null;
            var comments = req.body.comments || '';
            var imageStream = req.body.imageStream || null;

            var imageFile = null;
            var retval;
            if (imageStream) {
                //handle image stream storage

                imageFile = "filename.jpg";
            }
            comments = comments.replace(/[^\w\s\.,]/gi, '');
            date = Date.parse(date);
            var consumptionEntry = {
                userID: userId,
                date: date / 1000,
                bevID: beverage,
                starRating: rating,
                comments: comments
            };
            connection.query('INSERT INTO bevRating set ?', consumptionEntry, function (err, result) {
                if (err) {
                    console.log(err);
                    return err;
                } else {
                    console.log('rating has been saved: ', result);
                    res.setHeader('Content-Type', 'application/json');
                    res.send({error: false, message: 'Successfully entered consumption.'});
                }
            });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send({error: true, errors: {name: 'no user id', message: 'unable to enter consumption, no user id present'}});
        }
    });

    app.get('/reporting', isLoggedIn, function (req, res) {
        res.render('reporting.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'Reporting'
        });
    });

    app.get('/admin/reporting', isLoggedIn, function (req, res) {
        if(req.user.isadmin === 1) {
            res.render('admin_reporting.ejs', {
                user: req.user, // get the user out of session and pass to template
                title: 'Admin Reporting'
            });
        } else {
            res.render('reporting.ejs', {
                user : req.user, // get the user out of session and pass to template
                title: 'Reporting'
            });
        }
    });

    app.get('/api/getDrinks', function(req, res) {
        connection.query('SELECT * FROM beverage', function(err, result){
            if (err){
                console.log(err);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            }
        });
    });

    app.get('/api/getRatings', isLoggedIn, function(req, res) {
        var userId = req.user.userID;
        console.log("userId: ", userId);
        if(userId) {
            connection.query('SELECT * FROM bevRating where userID=?', userId, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                }
            });
        }
    });

    app.get('/api/getAllRatings', isLoggedIn, function(req, res) {
        var userId = req.user.userID;
        var isAdmin = req.user.isadmin || 0;
        if(userId && isAdmin == 1) {
            connection.query('select br.*, user.city, user.state, user.dob, user.gender from bevRating as br left join user on br.userID = user.userID', function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                }
            });
        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');

    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
