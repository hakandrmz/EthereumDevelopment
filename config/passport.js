const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//getting user model
const User = require("../model/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username",passwordField:"address" },
      (username, address, done) => {
        //matching user
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "kullanıcı adına kayıtlı hesap bulunamadı",
              });
            }
            //match address
            bcrypt.compare(address, user.address, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, {
                  message: "kullanıcıya kayıtlı cüzdan kodu yanlış",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
