var User = require("../modals/user")

module.exports = {
    loggedInUser: (req, res, next) => {
        if (req.session && req.session.userID) {
          next();
        } else {
          res.redirect("/users/login");
        }
      },
      userInfo: (req, res, next) => {
        var userID = req.session && req.session.userID;
        if (userID) {
          User.findById(userID, "Name email isAdmin plan", (err, user) => {
            if (err) return next(err);
            req.user = user;
            res.locals.user = user;
            next();
          });
        } else {
          req.user = null;
          res.locals.user = null;
          next();
        }
      },

      isAdmin : (req ,res ,next ) => {
          var isAdmin = req.user.isAdmin;
          if(isAdmin === true){
              next()
          } else {
              res.redirect('/podcasts')
          }
      }
      ,
      isUser :(req ,res ,next) => {
          var isAdmin = req.user.isAdmin;
          if(isAdmin === false) {
              next()
          } else {
            res.redirect('/podcasts')
          }
      }
}