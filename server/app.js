// indlæs express
const express = require('express');
const app = express();

// knyt morgan til som logger
const logger = require('morgan');
app.use(logger('dev'));

// sæt view-engine op til at benytte ejs
app.set('view engine', 'ejs'); // definer template engine
app.set('views', './server/views'); // definerer hvor ejs filerne er placeret
// app.engine('ejs', require('express-ejs-extend')); // tillad extends i ejs templates

app.engine('ejs', require('express-ejs-extend'));

const session = require('express-session')
app.use(session({
    secret: '16516f1651d651gdkjbhjnf5414sj514j5641fk',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30,
        secure: false
    }
}));

// konfigurer bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// altid logget ind som admin
// app.get("*", (req, res, next) => {
//     req.session.user_id = null;

//     next();
// })

// global validering
app.get("/admin/*", (req, res, next) => {
    if (req.session.user_id == undefined) {
        res.redirect('/');
    } else {
        next();
    }
})

require('./routes/frontend.js')(app);
require('./routes/user.js')(app);
require('./routes/login.js')(app);


// Bestem hvilken mappe der skal servere statiske filer
app.use(express.static('public'));

// start serveren på en port
const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('App is listening on http://localhost:' + port);
});