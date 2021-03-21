const express = require("express");
const ejs = require("ejs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const path = require("path");

//environment file
dotenv.config();

//passport config
require("./config/passport")(passport);

//express
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));

//bodyparser
app.use(express.urlencoded({ extended: false }));

//socket settings
var http = require("http").Server(app);
var io = require("socket.io")(http, {
  cors: { origin: "*", transports: ["xhr-polling"] },
});

//Connecting to DB and socket settings
const Ballots = require("./model/Ballot");
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      throw err;
    }
    console.log("connected to db");

    //Veri tabanında değişiklik olduğunda tüm kullanıcıların sayfası yenilenir.
    var clients = 0;
    io.sockets.on("connection", function (socket) {
      console.log("User connected");
      ++clients;
      socket.on("disconnect", function () {
        console.log("User disconnected");
        --clients;
      });
      Ballots.watch().on("change", () => {
        console.log("Veritabanında değişiklik yapıldı.");
        socket.emit("reload", clients);
      });
    });
  }
);

//express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//middleware parser
app.use(express.json());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/", require("./routes/ballots"));

// set port, listen for requests
const PORT = 80;
var server = http.listen(PORT, () => {
  console.log("server is running on port", server.address().port);
});
