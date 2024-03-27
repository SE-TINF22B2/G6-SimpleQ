const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var GitHubStrategy = require('passport-github').Strategy;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:7070/auth/google",
  passReqToCallback: true,
},
function(request: Express.Request, accessToken: string, refreshToken: string, profile: any, done: any) {
  return done(null, profile);
}));

passport.serializeUser(function(user: Express.User, done: any) {
  done(null, user);
});

passport.deserializeUser(function(user: Express.User, done: any) {
  done(null, user);
});


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:7070/api/auth/github"
  },
  function(accessToken: string, refreshToken: string, profile: any, cb: any) {
    return cb(null, profile)
  }
));