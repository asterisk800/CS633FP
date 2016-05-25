var mysql = require('mysql');

var cs633fp_db = mysql.createConnection({
    host: 'localhost',
    user: 'cs633fp',
    password: 'cs633fp',
    database: 'cs633fp',
    charset  : 'utf8'
}); 

exports.cs633fp_db = cs633fp_db;