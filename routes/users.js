const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//get routes
router.get("/login", (req, res) =>
  res.render("login", { name: req.body.username })
);
router.get("/register", (req, res) =>
  res.render("register", { name: req.body.username })
);
router.get("/account", (req, res) => {
  if (req.user) {
    res.render("account", {
      name: req.user.username,
      isadmin: req.user.isAdmin,
    });
  } else {
    res.render("account", { name: undefined, isadmin: undefined });
  }
});

//mongoose models
const User = require("../model/User");
const Ballot = require("../model/Ballot");

function validateInputAddresses(address) {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
}

router.post("/register", (req, res) => {
  const { isAdmin, username, address } = req.body;
  //creating errors array
  let errors = [];

  //checking required fields
  if (!isAdmin || !username || !address) {
    errors.push("tüm alanları doldurun");
  }

  if (address.length < 5) {
    errors.push({ msg: "adresinizi dogru girin" });
  } else {
    result = validateInputAddresses(address);
    if (result === false) {
      errors.push({ msg: "adresinizi dogru girin" });
    }
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name: undefined,
      address,
    });
  } else {
    //pass
    User.findOne({ username: username }).then(
      (user) => {
        if (user) {
          //user exist
          errors.push({ msg: "kullanıcı zaten kayıtlı" });
          res.render("register", {
            errors,
            name: undefined,
            address,
          });
        } else {
          const newUser = new User({
            isAdmin,
            username,
            address,
          });
          //hasing users wallet address
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.address, salt, (err, hash) => {
              if (err) throw err;
              //setting address to hash
              newUser.address = hash;
              //saving user
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "başırılı bir şekilde kayıtlı olundu lütfen giriş yapınız"
                  );
                  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            })
          );
        }
      }

      //hashing users wallet address
    );
  }
});
router.post("/login", (req, res, next) => {
  //her bir kullanıcı giriş yapmaya çalıştığında veri tabanında tarihleri kontrol ediyor.
  Ballot.find({}, function (err, ballots) {
    ballots.forEach(function (ballot) {
      if (ballot.finishDate < ballot.startDate) {
        ballot.ballotStatus = "closed";
        ballot.save();
      }
    });
  });
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
router.get("/logout", (req, res) => {
  7;
  //console.log(req.body)
  req.logout();
  req.flash("success_msg", "başarılı bir şekilde çıkış yaptınız");
  res.redirect("/users/login");
});

module.exports = router;
