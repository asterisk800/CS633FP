var mysql = require('mysql');

module.exports = mysql.createConnection(
    {
    host: 'localhost',
    user: 'cs633fp',
    password: 'cs633fp',
    database: 'cs633fp',
    charset: 'utf8'
    }
);
    