var express = require("express");
var router = express.Router();
var User = require("../modals/user");
/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.send("login success");
});

router.get("/register", (req, res, next) => {
  res.render("registration");
});

router.post("/register", (req, res, next) => {
  //console.log(req.body)
  User.create(req.body, (err, user) => {
    console.log(err, user);
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    // req.flash('error' ,'email/password are required')
    return res.redirect("/users/login");
  }

  if (password.length < 4) {
    // req.flash('errorPassword' ,'password less than four')
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // no user
    if (!user) {
      return res.redirect("/users/login");
    }

    // compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      console.log(err, result);
      if (!result) {
        // req.flash('wrongPassword' ,'password is worng')
        return res.redirect("/users/login");
      }

      // persist login user info
      req.session.userID = user.id;
      res.redirect("/articles/new");
    });
  });
});

//logout

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("Connect.sid");
  res.redirect("/users/login");
});

module.exports = router;
