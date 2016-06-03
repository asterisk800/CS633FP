var Connection = require('../config/db');


function addNewUser(username, password, dob, gender, city, state) {

    var newUser = {
        username: username,
        password: password,
        dob: dob,
        gender: gender,
        city: city,
        state: state
    };

    Connection.query('INSERT INTO user SET ?', newUser, function(err, result){
        if (err){
            console.log(err);
        }
        else
            console.log('User ' + newUser.username + ' has been saved!')

    });

    Connection.end(function (err) {
        console.log('Thread ID:' + Connection.threadId + ' has been terminated');

    })

}

module.exports = {
    addNewUser : addNewUser
}


