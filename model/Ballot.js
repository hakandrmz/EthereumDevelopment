const mongoose = require("mongoose");

const ballotSchema = new mongoose.Schema({
  ballotId: {
    type: String,
    default: Date.now,
  },
  ballotStatus: {
    type: String,
    enum: ["open", "freeze", "closed"],
    default: "open",
  },
  ballotSubject: {
    type: String,
    default: "Bitay Yetiştirme Programına başvuru.",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  finishDate: {
    type: Date,
    default: "2030-12-12",
  },
});

module.exports = mongoose.model("Ballot", ballotSchema);
