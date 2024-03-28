import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
require('dotenv').config()

//import middlewares
require('./middleware/auth.ts');
import isLoggedIn from './middleware/isLoggedin';
import configSession from './middleware/configSession';
import LoginWithCredentials from './api/auth/credentials/loginWithCredentials';

//import routes
import HelloWorld from './api/test/route';

const app = express();
const port = 7070;
configSession(app)
app.use(bodyParser.json());
  

app.get('/api/auth/google', passport.authenticate( 'google', {
    scope: ['openid', 'email', 'profile']
}));

app.get('/api/auth/github', passport.authenticate( 'github'), (req, res)=>{
    res.send("you are logged in")
});

app.post('/api/auth/credentials', LoginWithCredentials);

app.get('/api/test', isLoggedIn, HelloWorld);

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});