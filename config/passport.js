const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback' 
  },
  async (accessToken, refreshToken, profile, cb) => {
      const newUser = {
          googleID: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
      }

      try{
          let user = await User.findOne({ googleID: profile.id})

          if(user) {
              cb(null, user)
          }else {
              user = await User.create(newUser)
              cb(null, user)
          }
      }catch (error) {
          console.error(error)
      }
  }));

  passport.serializeUser(function(user, cb) {
      process.nextTick(function() {
        return cb(null, {
          id: user.id,
          username: user.username,
          picture: user.picture
        });
      });
    });
    
    passport.deserializeUser(function(user, cb) {
      process.nextTick(function() {
        return cb(null, user);
      });
    });
}

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
  
// async (accessToken, refreshToken, profile, cb) => {
//     const newUser = {
//         googleID: profile.id,
//         displayName: profile.displayName,
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         image: profile.photos[0].value
//     }

//     try{
//         let user = await User.findOne({ googleID: profile.id})

//         if(user) {
//             cb(null, user)
//         }else {
//             user = await User.create(newUser)
//             cb(null, user)
//         }
//     }catch (error) {
//         console.error(error)
//     }
// };