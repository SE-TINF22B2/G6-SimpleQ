import { use } from "passport";

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:7070/auth/google",
  passReqToCallback: true,
},
async function(request: Express.Request, accessToken: string, refreshToken: string, profile: any, done: any) {
  const { id, emails, username  } = profile;
    const email = emails ? emails[0].value : null;
    const user = await prisma.user.findUnique({ where: { id: id, name: username } });
    if (!user) {
      await prisma.user.create({
        data: {
          id: id,
          name: username,
          email: email ? email : null,
          provider: 'google',
          authVariant: 'jwt',
          image: profile.photos ? profile.photos[0].value : null,
        }
      });
    }
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
  async function(accessToken: string, refreshToken: string, profile: any, cb: any) {
    const { id, emails, username  } = profile;
    const email = emails ? emails[0].value : null;
    const user = await prisma.user.findUnique({ where: { id: id, name: username } });
    if (!user) {
      await prisma.user.create({
        data: {
          id: id,
          name: username,
          email: email ? email : null,
          provider: 'github',
          authVariant: 'jwt',
          image: profile.photos ? profile.photos[0].value : null,
        }
      });
    }

    return cb(null, profile)
  }
));