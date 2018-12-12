const uuidv4 = require('uuid/v4'); // genrere unikke nøgler
const bcrypt = require('bcrypt'); // password hashing
const date = require('date-and-time'); // benyttes til at lægge dage eller måneder til en dato

const sendmail = require('sendmail')({
    devPort: 25,
    devHost: "localhost", // Vigtigt
    smtpHost: "localhost",
    smtpPort: 25, // Default: 25
    silent: false
})

const user_service = require('../services/user');
const verify_service = require('../services/verify');

module.exports = (app) => {
    // ====================   Create User   ====================
    app.post('/register', (req, res) => {
        // opretter fejlbesked array
        let error_msg = [];
        console.log(req.body);

        // Validere på input felterne fra opret formen
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
            res.render('pages/register', {
                "page": "register",
                "title": "Register",
                "one_user": one_user,
                "session": req.session,
            });

        } else {
            // Hasher user password 
            bcrypt.hash(user_password, 10, (err, hashed_password) => {
                if (err) {
                    console.log(err);
                } else {
                    // opretter bruger i db, med den hashedede version af deres personlige kodeord.
                    user_service.create_user(user_name, user_email, hashed_password)
                        // user_service.check_existing_mail(user_id)
                        // Check DB for matching Mails!?

                        .then(user_id => {
                            // console.log(user_id);
                            // opretter variabler til UUID(unik nøgle), dato og udløbsdato til aktivering af bruger, 
                            let key = uuidv4();
                            let now = new Date();
                            let expires = date.addMonths(now, 1);

                            verify_service.insert_user_key(key, expires, user_id, 'verify')
                                .then(result => {
                                    let sender = 'no-reply@some-domain.com';
                                    let verify_url = `http://localhost:3000/verify/${key}`;
                                    let message = `
                                <h1>Hello ${user_name}</h1>
                                <p>Click on the following link, or copy the address, and paste it in the browser URL, to verify your account</p>
                                <p><a href="${verify_url}" target="_blank">${verify_url}</a></p>
                                <p></p>`;
                                    sendmail({
                                        from: sender,
                                        to: user_email,
                                        subject: 'verify your account',
                                        text: message,
                                        html: message
                                    }), (err, reply => {
                                        if (err) {
                                            console.log(err && err.stack);
                                        }
                                    });

                                    res.render('pages/verify', {
                                        "page": "verify",
                                        "title": "Verify Account",
                                        "session": req.session,
                                        "success": true,
                                    });

                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        })
                        .catch(error => {
                            console.log(error);
                            res.redirect('/verify');
                        });
                }
            });
        }
    });

    // ====================   Forgotten Password/key   ====================
    app.post('/forgotten/:key', (req, res) => {

    })

    // ====================   Forgotten Password   ====================
    app.post('/forgotten', (req, res) => {
        // opretter fejlbesked array
        let error_msg = [];

        // Validere på input felterne fra glemt kode formen 
        let forgotten_email = req.body.forgotten_email_input;
        if (forgotten_email == undefined || forgotten_email == "") {
            error_msg.push('forgotten_email is missing')
        }

        // hvis fejlbesked arrayet indeholder elementer, betyder det at noget er gået galt,
        // derfor returneres fejlbesked arrayet så klienten kan se besked i konsol
        if (error_msg.length > 0) {
            console.log(error_msg);
            // tilføj fejlbesked!!!
            res.redirect("/forgotten");
        } else {
            (async () => {
                try {
                    // Hent fra db
                    user_service.check_existing_mail(user_id)
                        .then(result => {
                            // emailen kunne ikke verificeres
                            // derfor renderes siden og man bliver sendt tilbage til formen.
                            res.render('pages/forgotten', {
                                "page": "forgotten",
                                "title": "Forgotten Email",
                                "forgotten_error": "email insn't in database, please register",
                                "session": req.session
                            });
                        });
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    });



    // ====================   Mailslurper test   ====================
    // app.get('/mailtest', (req, res) => {
    //     sendmail({
    //         from: 'no-reply@yourdomain.com',
    //         to: 'test@mail.dk',
    //         subject: 'test sendmail',
    //         html: 'Mail of test sendmail ',
    //     }, function (err, reply) {
    //         console.log(err && err.stack);
    //         console.dir(reply);
    //     });
    //     res.end("afsluttet");
    // })
}