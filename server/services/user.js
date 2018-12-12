// Referer til Moduler !!!
const mysql = require('../config/mysql.js');

module.exports = {
    // ====================   Create user   ====================
    create_user: (user_name, user_email, user_password) => {
        // starter med at "return new promise" som indeholder (resolve, reject)
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO users 
                            SET user_name = ?, 
                                user_email = ?, 
                                user_password = ?,
                                user_rank_level = 1, 
                                user_created = NOW(),
                                user_verified = false`, [user_name, user_email, user_password], (err, rows) => {
                    if (err) {
                        reject(err.message)
                    } else {
                        resolve(rows.insertId);
                    }
                });
            db.end();
        });
    },

    // ====================   Check DB for matching Mails (forgotten, create)   ====================
    check_existing_mail: (user_id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT user_id, user_email
                            FROM users 
                            WHERE user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if (rows.length == 1) {
                            resolve(rows[0]);
                        } else {
                            reject('email is alredy in db');
                        }
                    }
                });
            db.end();
        });
    },


    // ====================   retter verified værdi, i user tabel   ====================
    activate_user: (user_id) => {
        // starter med at "return new promise" som indeholder (resolve, reject)
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`UPDATE users
                        SET user_verified = true 
                        WHERE fk_user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if (rows.length == 1) {
                            resolve(rows[0]);
                        } else {
                            reject('user was not activated');
                        }
                    }
                });
            db.end();
        });
    },
}