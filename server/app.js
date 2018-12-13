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



const session = require('express-session')({
    secret: '16516f1651d651gdkjbhjnf5414sj514j5641fk',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dage
        secure: false
    }
});
app.use(session);


// konfigurer bodyparser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// definer hvilken port applikationen skal benytte
const port = 3000;

// indlæs IO modulet, knyt det til expressapp "lytteren"
const io = require('socket.io').listen(app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('App is listening http://localhost:' + port)
}));

// indlæs socket.io shared session modulet
const sharedsession = require('express-socket.io-session');
// bind socket og express modulerne sammen, så det er de samme session de arbejder på
io.use(sharedsession(session, {
    autoSave: true
}));

// funktionalitet der knyttes til socket-server-forbindelsen
// det er her de forskellige events defineres
io.on('connection', (socket) => {
    // server side delen af "message to server" beskeden
    socket.on('message to server', (msg) => {
        io.sockets.emit('message to clients', {
            'message': msg.message,
            'time': new Date(),
            'user': socket.handshake.session.user_email
        });
    });

});

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

