var Bookshelf = require('bookshelf');
var config = {
    host: 'localhost',
    user: 'cs633fp',
    password: 'cs633fp',
    database: 'cs633fp'
};

var cs633fp_db = Bookshelf.initialize({
    client: 'mysql',
    connection: config
});

module.exports.cs633fp_db = cs633fp_db;