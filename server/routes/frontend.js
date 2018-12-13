const bcrypt = require('bcrypt'); // password hashing

const user_service = require('../services/user');


module.exports = (app) => {
    // ========================   Index Page   ========================
    app.get('/', (req, res) => {
        res.render('pages/index', {
            "page": "index",
            "title": "Home",
            "login_error": "",
            "email_value": "",
            "session": req.session
        });
    });

    // ========================   Login Page   ========================
    app.get('/login', (req, res) => {
        res.render('pages/login', {
            "page": "login",
            "title": "Login",
            "login_error": "",
            "email_value": "",
            "session": req.session
        });
    });

    // ====================   Create User Page   ====================
    app.get('/register', (req, res) => {
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

        res.render('pages/register', {
            "page": "register",
            "title": "Register",
            "one_user": one_user,
            "session": req.session,
        });
    });

    // ========================   Verify Page   ========================
    app.get('/verify', (req, res) => {
        res.render('pages/verify', {
            "page": "verify",
            "title": "Verify Account",
            "session": req.session
        });
    });

    // ====================   Forgotten Password Page   ====================
    app.get('/forgotten', (req, res) => {
        res.render('pages/forgotten', {
            "page": "forgotten",
            "title": "Forgotten",
            "forgotten_error": "",
            "session": req.session,
        });
    });

    // ====================   User Activated Page   ====================
    app.get('/verify/:key', (req, res) => {
        user_service.activate_user(user_id)
        res.render('pages/activated', {
            "page": "activated",
            "title": "Activated",
            "session": req.session,
        });
    })

    // ========================   Chat Page   ========================
    app.get('/chat', (req, res) => {
        res.render('pages/chat', {
            "page": "chat",
            "title": "Chat",
            "login_error": "",
            "email_value": "",
            "session": req.session
        });
    });
}