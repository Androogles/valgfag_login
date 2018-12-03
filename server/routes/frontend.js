const path = require('path');
const bcrypt = require('bcrypt');


const frontend_service = require(path.join(__dirname, '..', 'services', 'frontend.js'));

module.exports = (app) => {
    // ========================   Index (Login) Page   ========================
    app.get('/', (req, res) => {
        (async () => {
            try {
                res.render('pages/index', {
                    "page": "index",
                    "title": "landing page",
                    "login_error": "",
                    "email_value": "",
                    "session": req.session
                });
            }
            catch (error) {
                console.log(error);
            }
        })();
    });

    // ====================   Login   ====================
    app.post('/login', (req, res) => {
        frontend_service.login_hash(req.body.user_email_input)
            .then(user => {
                // sammenligner kodeord fra formularen, med hashet_kodeord fra database
                bcrypt.compare(req.body.user_password_input, user.user_password)
                    .then(result => {
                        // hvis resultatet er præcis true, er kodeord det korrekte
                        if (result === true) {
                            // sætter cookie så den udløbber når browser lukkes.
                            req.session.cookie.expires = false;
                            // gem de nødvendige variabler i vores session variabel.
                            req.session.user_id = user.user_id;
                            res.redirect('/admin/index');
                        } else {
                            // kodeordet kunne ikke verificeres, dvs brugeren er ikke logget på
                            res.render('pages/index', {
                                "page": "index",
                                "title": "landing page",
                                "login_error": "wrong email or password",
                                "email_value": req.body.user_email_input,
                                "session": req.session
                            });
                        }
                    });
            })
            .catch(error => {
                res.render('pages/index', {
                    "page": "index",
                    "title": "landing page",
                    "login_error": "wrong email or password",
                    "email_value": req.body.user_email_input,
                    "session": req.session
                });
                console.log(error);
            })
    });

    // ====================   Logout   ====================
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) { console.log(err); }
            res.redirect('/');
        });
    });





    // ====================   Create User Page   ====================
    app.get('/signup', (req, res) => {
        (async () => {
            try {
                let one_user = {
                    "user_id": 0,
                    "user_name": "",
                    "user_email": "",
                    "user_password": "",
                    "user_lastname": "",
                    "user_rank_level": 0,
                    "user_created": "",
                    "user_confirmed": ""
                };

                res.render('pages/signup', {
                    "page": "signup",
                    "title": "Signup",
                    "one_user": one_user,
                    "session": req.session,
                });

            } catch (error) {
                console.log(error);
            }
        })();
    });

    // ====================   Create User   ====================
    app.post('/signup', (req, res) => {
        let error_msg = [];

        let user_name = req.body.user_name_input;
        if (user_name == undefined || user_name == "") {
            error_msg.push('user_name is missing')
        }

        let user_email = req.body.user_email_input;
        if (user_email == undefined || user_email == "") {
            error_msg.push('user_email is missing')
        }

        let user_password = req.body.user_password_input;
        if (user_password == undefined || user_password == "") {
            error_msg.push('user_password is missing')
        }

        // Hvis fejlbesked arrayet indeholder elementer, betyder det at noget er gået galt,
        // Derfor returneres fejlbesked arrayet så klienten kan se besked i konsol
        if (error_msg.length > 0) {
            console.log(error_msg);
            // tilføj fejlbesked
            res.redirect("/signup");
        } else {
            bcrypt.hash(user_password, 10, (err, hashed_password) => {
                if (err) {
                    console.log(err);
                }
                frontend_service.create_user(user_name, user_email, hashed_password)
                    .then(result => {
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/');
                    });
            });
        }
    });
}