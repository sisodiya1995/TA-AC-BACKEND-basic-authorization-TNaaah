var express = require('express');
const { isUser } = require('../middlewares/auth');
var router = express.Router();
var auth  = require('../middlewares/auth')
var Podcast = require('../modals/podcast')
/* GET home page. */

router.get('/',isUser, function(req, res, next) {
    console.log(req.user)
    let userPlan =req.user.plan ;
    if(userPlan === "free") {
      Podcast.find({podcastPlan : userPlan},(err ,Podcast) =>{
        res.render('adminDashboard' ,{Podcast :Podcast})
      })
    }
   
    if(userPlan === "Vip") {
      let userPlan =req.user.plan ;
      Podcast.find({podcastPlan :{$in:['Vip','free']}},(err ,Podcast) =>{
        res.render('adminDashboard' ,{Podcast :Podcast})
      })
    }

    if(userPlan === "Primeum") {
      Podcast.find({},(err ,Podcast) =>{
        res.render('adminDashboard' ,{Podcast :Podcast})
      })
    }
  });

router.get('/new', function(req, res, next) {
  res.render('addpodcast')
});

router.post('/',auth.isAdmin,function(req, res, next) {
      var userID = req.user.userID;
      req.body.userID = userID;
      Podcast.create(req.body,(err ,createPodcast) => {
          console.log(err ,createPodcast ,"create podcast")
          res.redirect('/podcasts/new')
      })
  });
  
//admin dashboard

  router.get('/adminDashboard' ,(req ,res) => {
    Podcast.find({} ,(err ,Podcast) => {
      res.render('adminDashboard' ,{Podcast :Podcast})
    })
  })

// edit podcast
  router.post('/:id/edit' ,(req ,res) => {
    var id  = req.params.id;
    Podcast.findByIdAndUpdate(id,req.body ,(err ,updatepodcast) => {
      res.redirect('/podcasts/adminDashboard')
    })
    
  })


  router.get('/:id/edit' ,(req ,res) => {
    var id  = req.params.id;
    Podcast.findById(id ,(err ,podcast) => {
      res.render('editpodcast' ,{podcast :podcast})
    })
    
  })

  // delete podcast
  router.get('/:id/delete' ,(req ,res) => {
    var id  = req.params.id;
    Podcast.findByIdAndDelete(id ,(err ,delpodcast) => {
      console.log(err ,delpodcast)
      res.redirect('/podcasts/adminDashboard')
    })
  })

module.exports = router;
