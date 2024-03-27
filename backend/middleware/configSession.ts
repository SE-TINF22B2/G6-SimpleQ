const express = require("express");
const session = require('express-session');
const PrismaSessionStore = require('@quixo3/prisma-session-store').PrismaSessionStore;
const { PrismaClient } = require('@prisma/client')
const passport = require('passport')

const sessionOptions = {
    secret: 'cats', 
    resave: false, 
    saveUninitialized: false,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2.4e+6,
      dbRecordIdIsSessionId: true,
    }),
};

export default function configSession(app: typeof express) {
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());
}