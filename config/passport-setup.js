const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new googleStrategy(
    {
      //options for google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function

      //check if user already exists in db
      User.findOne({
        googleId: profile.id
      }).then(currentUser => {
        if (currentUser) {
          console.log("user is " + currentUser);
          done(null, currentUser); // null is passing an error if there is one
        } else {
          //create user in db
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.image.url,
            access_token: accessToken,
            refresh_token: refreshToken
          })
            .save()
            .then(newUser => {
              console.log("newUserCreated:" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
