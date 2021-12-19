const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../http/models/user");

function facebookInit(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
        profileFields: [
          "id",
          "displayName",
          "first_name",
          "last_name",
          "gender",
        ],
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne(
          {
            googleId: profile.id,
          },
          function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              console.log("user found");
              console.log(user);
              return done(null, user);
            } else {
              var newUser = new User();
              newUser.googleId = profile.id;
              newUser.displayName = profile.displayName;
              newUser.name.firstName = profile.name.givenName;
              newUser.name.lastName = profile.name.familyName;
              newUser.name.middleName = profile.name.middleName;
              newUser.gender = profile.gender;

              //   save our user to the database
              newUser.save(function (err) {
                if (err) {
                  console.log(profile);
                  throw err;
                }
                // if successful , return the new user
                return done(null, newUser);
              });
            }
          }
        );
        console.log(profile);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    return done(null, id);
  });
}

module.exports = facebookInit;
