const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
  if (req.user) {
    res.render("home", { name: req.user.username, isadmin: req.user.isAdmin });
  } else {
    res.render("home", { name: undefined, isadmin: undefined });
  }
});

router.get("/create", (req, res) => {
  if (req.user) {
    res.render("create", { name: req.user.username, isadmin: req.user.isAdmin });
  } else {
    res.render("create", { name: undefined, isadmin: undefined });
  }
});


module.exports = router;
