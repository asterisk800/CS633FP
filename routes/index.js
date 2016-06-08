var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Home'});
});


// Features
router.get('/features', function(req, res){
  res.render('features', {title: 'Features'});
});

// About-us
router.get('/about-us', function(req, res){
  res.render('about-us', {title: 'About Us'});
});

module.exports = router;
