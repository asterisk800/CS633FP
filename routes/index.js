// app/routes.js
module.exports = function(app, passport) {



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('login', {title: 'Login'}); // load the index.ejs file
    });

    app.get('/features', function(req, res) {
        res.render('features.ejs', {title: 'Features'}); // load the index.ejs file
    });

    app.get('/about-us', function(req, res) {
        res.render('about-us.ejs', {title: 'About Us'}); // load the index.ejs file
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
    router.get('/enter', isLoggedIn, function (req, res) {
        res.render('enter.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'Enter Consumption'
        });
    });

    router.post('/enter', isLoggedIn, function(req, res){
        var userId = req.user;

        var date = req.body.date || null;
        var beverage = req.body.bevID || null;
        var rating = req.body.rating || null;
        var comments = req.body.comments || '';
        var imageStream = req.body.imageStream || null;

        return connection.addConsumptionEntry(userId, date, beverage, rating, imageStream, comments)
    });

    router.get('/reporting', isLoggedIn, function (req, res) {
        res.render('reporting.ejs', {
            user : req.user, // get the user out of session and pass to template
            title: 'Reporting'
        });
    });


    app.get('/api/getDrinkTypes', isLoggedIn, function(req, res) {
        Connection.query('SELECT * FROM drinkTypes', function(err, result){
            if (err){
                console.log(err);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            }
        });
    });

    app.get('/api/getDrinkBrands', isLoggedIn, function(req, res) {
        Connection.query('SELECT * FROM drinkBrands', function(err, result){
            if (err){
                console.log(err);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            }
        });
    });

    app.get('/api/getConsumption', isLoggedIn, function(req, res) {
        var userId = req.user;
        Connection.query('SELECT * FROM consumption where userId=?', userId, function(err, result){
            if (err){
                console.log(err);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(result);
            }
        });
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
