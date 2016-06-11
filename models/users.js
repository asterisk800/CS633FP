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

    });

};

function addConsumptionEntry(date, beverage, rating, imageStream, comments){
    var imageFile = null;
    var retval;
    if(imageStream){
        //handle image stream storage

        imageFile = "filename.jpg";
    }
    comments = comments.replace(/[^\w\s\.,]/gi, '');
    date = Date.parse(date);
    console.log(date);
    var consumptionEntry = {
        userId: 1,
        date: date/1000,
        drinkBrandId: beverage,
        starRating: rating,
        image: imageFile,
        comment: comments
    };
    console.log(consumptionEntry);
    return Connection.query('INSERT INTO consumption set ?', consumptionEntry, function(err, result){
        if(err){
            console.log(err);
            endConnection();
            return err;
        } else {
            console.log('rating has been saved: ', result);
            return result;
        }
    });
}

function endConnection(){
    Connection.end(function (err) {
        console.log('Thread ID:' + Connection.threadId + ' has been terminated');

    });
}

module.exports = {
    addNewUser : addNewUser,
    addConsumptionEntry : addConsumptionEntry
};


