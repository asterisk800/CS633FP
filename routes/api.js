'use strict';

var express = require('express');
var router = express.Router();
var Connection = require('../config/db');



router.get('/getDrinkTypes', function (req, res) {
    Connection.query('SELECT * FROM drinkTypes', function(err, result){
        if (err){
            console.log(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
    });
});

router.get('/getDrinkBrands', function (req, res) {
    Connection.query('SELECT * FROM drinkBrands', function(err, result){
        if (err){
            console.log(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
    });
});

router.get('/getConsumption/:userId', function (req, res) {

    var userId = req.params.userId;
    Connection.query('SELECT * FROM consumption where userId=?', userId, function(err, result){
        if (err){
            console.log(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
    });
});

module.exports = router;
