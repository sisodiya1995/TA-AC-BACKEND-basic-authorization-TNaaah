var express = require("express");
var router = express.Router();
var Article = require("../modals/article");
var Comment = require("../modals/comment");
const User = require("../modals/user");

// comment Edit Route
router.get("/:slug/edit", (req, res, next) => {
  var slug = req.params.slug;
  Comment.findOne({ slug: slug }, (err, comment) => {
    // console.log(comment);
    if (err) return next(err);
    res.render("editComment", { comment: comment });
  });
});

router.post("/:slug/edit", (req, res, next) => {
  var slug = req.params.slug;
  // console.log(slug)

  Comment.findOneAndUpdate({ slug: slug }, req.body, (err, remarks) => {
    console.log(remarks);
    res.redirect("/articles/" + remarks.articleSlug);
  });
});

// Comment Delete
router.get("/:slug/delete", (req, res, next) => {
  var slug = req.params.slug;
   var userId = req.session.userID;
   
  //console.log(slug ,"del slug")
//   Comment.findOne({slug : slug},(err,comment) => {
//     //console.log(comment ,'del comment')
//     var commentSlug =comment.articleSlug;
//     console.log(commentSlug ,'comment slug')
//     Article.findOne({slug :commentSlug} ,(err ,article) => {

//      // console.log(article ,'del article')
//      var articleSlug = article.slug;
//     console.log(articleSlug ,'artti slug')
//       if(articleSlug === commentSlug) {
// Comment.findOneAndRemove({ slug: slug }, (err, deleteremarks) => {
//     //console.log(deleteremarks, "delete comment");
//     if (err) return next(err);
//     Article.findByIdAndUpdate(deleteremarks.articleID, {
//       $pull: { commentID: deleteremarks._id },
//     });
//     res.redirect("/articles/" + deleteremarks.articleSlug);
//   });
//       } else {
//         res.redirect('/articles')
//       }
//     })
//   })


  // Comment.findOneAndRemove({ slug: slug }, (err, deleteremarks) => {
  //   console.log(deleteremarks, "delete comment");
  //   if (err) return next(err);
  //   Article.findByIdAndUpdate(deleteremarks.articleID, {
  //     $pull: { commentID: deleteremarks._id },
  //   });
  //   res.redirect("/articles/" + deleteremarks.articleSlug);
  // });


});

// comment likes

router.get("/:slug/likes", (req, res, next) => {
  var slug = req.params.slug;
  //console.log(slug);
  Comment.findOneAndUpdate(
    { slug: slug },
    { $inc: { likes: 1 } },
    (err, comment) => {
      console.log(comment, "comment");
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleSlug);
    }
  );
});

// Remarks dislikes

router.get("/:slug/dislikes", (req, res, next) => {
  var slug = req.params.slug;
  Comment.findOne({ slug: slug }, (err, remark) => {
    if (remark.likes > 0) {
      Comment.findOneAndUpdate(
        { slug: slug },
        { $inc: { likes: -1 } },
        (err, article) => {
          //console.log(article);
          if (err) return next(err);
          res.redirect("/articles/" + article.articleSlug);
        }
      );
    } else {
      Comment.findOne({ slug: slug }, (err, article) => {
        console.log(article);
        res.redirect("/articles/" + article.articleSlug);
      });
    }
  });
});

module.exports = router;
