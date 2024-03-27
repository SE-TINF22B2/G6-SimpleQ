const passport = require('passport');

export default function GooglePassport(){
    passport.authenticate( 'google', {
        successRedirect: '/api/test',
        failureRedirect: '/api/test'
    })
}