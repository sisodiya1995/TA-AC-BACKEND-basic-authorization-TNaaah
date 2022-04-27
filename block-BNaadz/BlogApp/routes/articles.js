var express = require("express");
var router = express.Router();
var Article = require("../modals/article");
var Comment = require("../modals/comment");
const User = require("../modals/user");
var auth = require("../middlewares/auth");
/* GET home page. */

//read
router.get("/", (req, res, next) => {
  console.log(req.session);
  Article.find({}, (err, articles) => {
    //console.log(err ,articles)
    if (err) return next(err);
    res.render("articles", { articles });
  });
});

router.get("/new", auth.loggedInUser, function (req, res, next) {
  res.render("articleform");
});
router.get("/:slug", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOne({ slug: slug })
    .populate("commentID").populate("authorname" ,'firstName lastName password')
    .exec((err, article) => {
      console.log(article);
      if (err) return next(err);
      res.render("singleArticle", { article });
    });
});


// middleware
router.use(auth.loggedInUser);
// create

router.post("/", (req, res, next) => {
  // console.log(req.body)
  req.body.authorname = req.user.id;
  Article.create(req.body, (err, articles) => {
    // console.log(event);
    if (err) return next(err);
    res.redirect("/articles/new");
  });
});



// Edit route (only author of article edit )
router.get("/:slug/edit", (req, res, next) => {
  var slug = req.params.slug;
  var userID = req.session.userID;
  Article.findOne({ slug: slug }).populate('authorname').exec((err ,arti) => {
    var authorID =arti.authorname.id;
    if(userID === authorID) {
      Article.findOne({ slug: slug }, (err, article) => {
        //console.log(article)
        if (err) return next(err);
        res.render("articleEditForm", { article });
      });
    } else {
      res.redirect('/articles')
    }
  })
  
});

router.post("/:slug/edit", (req, res, next) => {
  var slug = req.params.slug;
  var userID = req.session.userID;
  Article.findOne({ slug: slug }).populate('authorname').exec((err ,arti) => {
    var authorID =arti.authorname.id;
    if(userID === authorID){
      Article.findOneAndUpdate({ slug: slug }, req.body, (err, updateArticle) => {
        console.log(updateArticle);
        if (err) return next(err);
        res.redirect("/articles/" + slug);
      });
    } else {
      res.redirect('/articles')
    }
  })
  
});

// delete (only author of can delete article)
router.get("/:slug/delete", (req, res, next) => {
  var slug = req.params.slug;
  var userID = req.session.userID;
  Article.findOne({slug :slug}).populate('authorname').exec((err ,art) => {
    var authorID =art.authorname.id;
    if(userID === authorID){
      Article.findOneAndDelete({ slug: slug }, (err, deleteArticle) => {
        if (err) return next(err);
        res.redirect("/articles/");
      });
    } else {
      res.redirect("/articles/")
    }

  })
  
});

// Article Likes

router.get("/:slug/like", (req, res, next) => {
  var slug = req.params.slug;

  Article.findOneAndUpdate(
    { slug: slug },
    { $inc: { likes: 1 } },
    (err, incrementLikes) => {
      console.log(incrementLikes);
      if (err) return next(err);
      res.redirect("/articles/" + slug);
    }
  );
});

// Article Dislike

router.get("/:slug/dislike", (req, res, next) => {
  var slug = req.params.slug;
  Article.findOne({ slug: slug }, (err, decerementLikes) => {
    if (decerementLikes.likes > 0) {
      Article.findOneAndUpdate(
        { slug: slug },
        { $inc: { likes: -1 } },
        (err, event) => {
          console.log(event);
          if (err) return next(err);
          res.redirect("/articles/" + slug);
        }
      );
    } else {
      res.redirect("/articles/" + slug);
    }
  });
});

// addcomments

router.post("/:slug/comment", (req, res, next) => {
  req.body.articleID = req.params.id;
  var slug = req.params.slug;
  req.body.articleSlug = slug;
  req.body.loggeduserID = req.user.id;
  console.log(req.params.id, "id");
  Comment.create(req.body, (err, comment) => {
    console.log(comment ,'create comment');
    if (err) return next(err);
    Article.findOneAndUpdate(
      { slug: slug },
      { $push: { commentID: comment.id } },
      (err, updatearticle) => {
       // console.log(err, updatearticle);
        res.redirect("/articles/" + updatearticle.slug);
      }
    );
  });
});

module.exports = router;
