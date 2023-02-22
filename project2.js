// Import library
const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

// Initial express app
const app = express();
const PORT = 3000;

// Add the Express-session options
const oneDay = 1000 * 60 * 60 * 24; // 24 hours
app.use(sessions({
    secret: "Mykey",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// Parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving public file
app.use(express.static(__dirname));

// Cookie parser middleware
app.use(cookieParser());

// Setup authorization credentials
const myusername = 'admin'
const mypassword = '12345'

// a variable to save a session
var session;



// page => Welcome
app.get('/', (req, res) => {
    session = req.session;
    if(session.userid){
        res.send("Welcome User <a href=\'/logout'>Logout</a>");
    }else
    res.sendFile("views/login2.html", {root: __dirname})
});

// page => User
app.post('/user', (req, res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.sendFile("views/Homepage.html", {root: __dirname});
    }
    else {
        // Login failed, display an error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.innerHTML = 'Incorrect username or password';
        form.appendChild(errorElement);
      }
})

/* ROUTES SETUP */
const port = process.env.PORRT || 3000;
app.listen(port, () => console.log('App listening on port' + port));

app.get('/', (req, res) => res.sendFile('/views/login2.html', {root : __dirname}));
app.get('/success', (req, res) => res.send('You have successfully logged in'));
app.get('/error', (req, res) => res.send('error logging in'));

// page => Error
app.get('*', (req, res) => {
    res.send('Page not found (Error 404)')
})

// page => Logout
app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
});


/* PASSPORT SETUP */
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb){
    cb(null, user);
});

passport.deserializeUser(function(obj, cb){
    cb(null, obj);
});


/* FACEBOOK AUTH */
const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = '1960601660777223';
const FACEBOOK_APP_SECRET = '5385f9087dfa90796975b174b7aefa0f';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/error' }),
    function(req, res) {
        request.redirect('/views/Homepage.html.html');
    });
