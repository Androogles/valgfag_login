const bcrypt = require('bcrypt'); // password hashing

const login_service = require('../services/login');


module.exports = (app) => {
    // ====================   Login   ====================
    app.post('/login', (req, res) => {
        // opretter fejlbesked array
        let error_msg = [];

        // Validere på input felterne fra login formen 
        let user_email = req.body.user_email_input;
        if (user_email == undefined || user_email == "") {
            error_msg.push('user_email is missing')
        }

        let user_password = req.body.user_password_input;
        if (user_password == undefined || user_password == "") {
            error_msg.push('user_password is missing')
        }

        // hvis fejlbesked arrayet indeholder elementer, betyder det at noget er gået galt,
        // derfor returneres fejlbesked arrayet så klienten kan se besked i konsol
        if (error_msg.length > 0) {
            console.log(error_msg);
            // tilføj fejlbesked!!!
            res.redirect("/login");
        } else {
            (async () => {
                try {
                    // Hent fra db
                    login_service.login_hash(req.body.user_email_input)
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
                                        res.redirect('/');
                                    } else {
                                        // kodeordet kunne ikke verificeres, dvs brugeren er ikke logget på
                                        // derfor renderes login siden
                                        res.render('pages/login', {
                                            "page": "login",
                                            "title": "Login",
                                            "login_error": "wrong email or password",
                                            "email_value": req.body.user_email_input,
                                            "session": req.session
                                        });
                                    }
                                });
                        })
                        // kodeordet kunne ikke verificeres, dvs brugeren er ikke logget på
                        // derfor renderes index/login siden
                        .catch(error => {
                            res.render('pages/login', {
                                "page": "login",
                                "title": "Login",
                                "login_error": "wrong email or password",
                                "email_value": req.body.user_email_input,
                                "session": req.session
                            });
                            console.log(error);
                        })
                }
                catch (error) {
                    console.log(error);
                }
            })();
        }
    });

    // ====================   Logout   ====================
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    });
}