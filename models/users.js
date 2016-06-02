var DB = require('../config/db');
var bcrypt = require('bcrypt-nodejs');
module.exports = {

findAll: function() {DB.query('select * from cs633fp.user;', function(err, results, fields) {
    if(err)
        throw err;
    else
        return results;

})},

endConnection: function() {DB.end(function (err) {
    console.log('Thread ID:' + DB.threadId + ' has been terminated');

})},

createUser: function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
}

