const LocalStrategy = require('passport-local').Strategy
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  // passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  //   User.findOne({ email: email.toLowerCase() }, (err, user) => {
  //     if (err) { return done(err) }
  //     if (!user) {
  //       return done(null, false, { msg: `Email ${email} not found.` })
  //     }
  //     if (!user.password) {
  //       return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
  //     }
  //     user.comparePassword(password, (err, isMatch) => {
  //       if (err) { return done(err) }
  //       if (isMatch) {
  //         return done(null, user)
  //       }
  //       return done(null, false, { msg: 'Invalid email or password.' })
  //     })
  //   })
  // }))
  passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.google.com/oauth2/authorize',
    tokenURL: 'https://www.google.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret',
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate( function(err, user) {
      done(err, user);
    });
  }
));
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
