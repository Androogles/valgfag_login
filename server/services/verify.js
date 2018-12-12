// Referer til Moduler !!!
const mysql = require('../config/mysql.js');

module.exports = {
    // ====================   Henter uuid   ====================
    recieve_user_key: (user_id) => {
        // starter med at "return new promise" som indeholder (resolve, reject)
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT uuid, expire_date, fk_user_id
                            FROM verify_keys  
                            WHERE fk_user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if (rows.length == 1) {
                            resolve(rows[0]);
                        } else {
                            reject('could not recieve key');
                        }
                    }
                });
            db.end();
        });
    },

    // ====================   Opretter uuid   ====================
    insert_user_key: (key, expires, user_id) => {
        // console.log(key, expires, user_id);
        // starter med at "return new promise" som indeholder (resolve, reject)
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO verify_keys 
                            SET uuid = ?, 
                            expire_date = ?,
                            fk_user_id = ?`, [key, expires, user_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        });
    },

    // ====================   Sletter uuid   ====================
    delete_user_key: (user_id) => {
        // starter med at "return new promise" som indeholder (resolve, reject)
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`DELETE FROM verify_keys 
                            WHERE fk_user_id = ?`, [user_id], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if (rows.length == 1) {
                            resolve(rows[0]);
                        } else {
                            reject('key was not deleted');
                        }
                    }
                });
            db.end();
        });
    },

}