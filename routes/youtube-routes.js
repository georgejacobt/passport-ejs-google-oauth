const router = require("express").Router();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const keys = require("../config/keys");

const authCheck = (req, res, next) => {
  if (!req.user) {
    //if user isn nto logged in
    res.redirect("/auth/login");
  } else {
    //if logged in
    next();
  }
};

router.get("/", authCheck, function(req, res) {
  console.log(req.user);

  var oauth2Client = new OAuth2(
    keys.google.clientID,
    keys.google.clientSecret,
    keys.youtube.callbackurl
  );

  oauth2Client.credentials = {
    access_token: req.user.access_token,
    refresh_token: req.user.refresh_token
  };

  google
    .youtube({
      version: "v3",
      auth: oauth2Client
    })
    .search.list({
      part: "id,snippet",
      q: "malayalam songs"
    })
    .then(data => {
      //   res.send("you tube data received");
      console.log("here itis" + data.data.items[1].snippet.title);
      res.json(data.data);
    });
});

module.exports = router;
