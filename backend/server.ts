import express, { NextFunction, Request, Response } from 'express';
import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';

require('dotenv').config()

//middlewares
require('./middleware/auth.ts');
import isLoggedIn from './middleware/isLoggedin';
import GooglePassport from './middleware/passport';

//routes
import HelloWorld from './api/test/route';

const app = express();
const port = 7070;
  
const sessionOptions: SessionOptions = {
    secret: 'cats', 
    resave: false, 
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2.4e+6,
      dbRecordIdIsSessionId: true,
    }),
  };
app.use(session(sessionOptions));
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