const router = require("express").Router();
const passport = require("passport");
// auth login

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

//auth logout
router.get("/logout", (req, res) => {
  //handle with passport
  req.logout();
  res.redirect("/");
});

// auth with google -- this is where we interact with passport

// router.get("/google", (req, res) => {
//   res.send("logging in with Google");
// });

// if you want other stuff you can comma seperate them here in this array eg: youtube
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "https://www.googleapis.com/auth/youtube"],
    accessType: "offline"
  })
);

//callback route for google to redirect to

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  //   res.send(req.user);
  res.redirect("/profile");
});

module.exports = router;
