const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Ballot = require("../model/Ballot");


router.get("/dashboard", ensureAuthenticated, (req, res) => {
  Ballot.find({}, async (err, ballots) => {
    foundBallots = ballots;
    if (foundBallots) {
      res.render("dashboard", {
        name: req.user.username,
        isadmin: req.user.isAdmin,
        foundBallots,
      });
    } else if (err) {
      console.log(err); 
    } else {
      res.render("dashboard", {
        name: req.user.username,
        isadmin: req.user.isAdmin,
      });
    }
  });
});

router.post("/changestatus", (req, res) => {
  const obj = JSON.parse(req.body.ballotstatus);
  id = obj.id;
  status = obj.status;

  Ballot.findById({ _id: id }).then((foundBallot) => {
    foundBallot.ballotStatus = status;
    foundBallot.save();
  });
  res.redirect("dashboard");
});

router.post("/create", (req, res) => {
  status = req.body.status;
  id = req.body.ballotid;
  subject = req.body.ballotsubject;
  finishdate = req.body.finishdate;
  let errors = [];

  if (!status || !subject || !finishdate || !id) {
    errors.push("Boş alanları doldurun.");
  } else {
    Ballot.findOne({ ballotId: id }).then((ballot) => {
      if (ballot) {
        errors.push({ msg: "Bu oylama id'si kayıtlı" });
        res.render("create", {
          errors,
          name: req.user.username,
          isadmin: req.user.isAdmin,
        });
      } else {
        const newBallot = new Ballot({
          ballotStatus: status,
          ballotId: id,
          ballotSubject: subject,
          finishDate: finishdate,
        });
        newBallot
          .save()
          .then((ballot) => {
            req.flash("success_msg", "oylamanız yayınlandı");
            res.redirect("dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
});

module.exports = router;
