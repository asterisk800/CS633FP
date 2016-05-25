var DB = require('../config/db');

DB.cs633fp_db.connect(function(err) {
    if (err){
        console.error('error connecting: ' + err.stack)
        return;
    }
    console.log('Connected as id:' + DB.cs633fp_db.threadId)
});

DB.cs633fp_db.query('select * from cs633fp.user;', function(err, results, fields) {
    if(err) throw err;
    console.log(results);
    });

