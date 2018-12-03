// Referer til Moduler !!!
const mysql = require('../config/mysql.js');

module.exports = {
    // ====================   Login   ====================
    login_hash: (user_email) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT user_id, user_email, user_password
                        FROM users 
                        WHERE user_email = ?`, [user_email], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if (rows.length == 1) {
                            resolve(rows[0]);
                        } else {
                            reject('wrong email or password');
                        }
                    }
                });
            db.end();
        });
    },


    // ====================   Create user   ====================
    create_user: (user_name, user_email, user_password) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO users 
                            SET user_name = ?, 
                                user_email = ?, 
                                user_password = ?,
                                user_rank_level = 1, 
                                user_created = NOW(),
                                user_confirmed = 1`, [user_name, user_email, user_password], (err, rows) => {
                    if (err) {
                        reject(err.message)
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },
}