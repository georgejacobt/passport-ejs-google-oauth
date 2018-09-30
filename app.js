const express = require("express");
const profileRoutes = require("./routes/profile-routes");
const authRoutes = require("./routes/auth-routes");
const youtubeRoutes = require("./routes/youtube-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const app = express();

app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

// inittialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(
  keys.mongodb.dbURI,
  () => {
    console.log("connected to mongodb");
  }
);

//set up routes

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/youtube", youtubeRoutes);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("app now lisenting for requests on prt 3000");
});
