import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
require('dotenv').config()

//middlewares
require('./middleware/auth.ts');
import isLoggedIn from './middleware/isLoggedin';
import GooglePassport from './middleware/passport';

//routes
import HelloWorld from './api/test/route';


const app = express();
const port = 7070;
  
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/auth/google', passport.authenticate( 'google', {
    scope: ['openid', 'email', 'profile']
}));

app.get('/api/auth/github', passport.authenticate( 'github'), (req, res)=>{
    res.send("you are logged in")
});

app.get('/api/test', isLoggedIn, HelloWorld);

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});