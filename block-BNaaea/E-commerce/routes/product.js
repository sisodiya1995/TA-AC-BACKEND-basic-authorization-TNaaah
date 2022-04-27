var express = require('express');
var router = express.Router();
var User = require('../modals/user')
var Product = require('../modals/product')
var WishList = require('../modals/wishlist')
var Cart =require('../modals/cart')
var auth = require('../middlewares/auth')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// add product by 
router.get('/new' ,(req ,res ,next) => {
    //console.log(req.session.userID)
   var userID = req.session.userID;
   User.findById(userID ,(err ,user) => {
     if(user.isAdmin === true) {
       return res.render('addProduct')
     } else {
       return res.redirect('/product')
     }
   })

})

router.post('/' ,(req ,res) => {
   Product.create(req.body ,(err ,product) => {
     console.log(err ,product)
     res.redirect('/product/new')
   })
})

// all product

router.get('/' ,(req ,res) => {
  var userID = req.session.userID;
  var isAdmin = false;
  var isRegister = true;

// if no user
  if(! userID) {
     isAdmin = false;
     isRegister = false ;
  }

  // if user is register
if(isRegister === true) {
   User.findById(userID ,(err ,user) =>{
    console.log(user.isAdmin ,"admin login")
     if(user.isAdmin === true) {
       isAdmin = true;
     }
   })
}
  
  Product.find({} ,(err ,products) => {
    //console.log(err ,products)

    res.render('products' ,{products ,isAdmin , isRegister})
  })
})

// edit by admin


// router.get('/:id/edit',(req ,res) => {
//   var id  = req.params.id;
//   var userID = req.session.userID;
//   User.findById(userID ,(err ,user) => {
//     if(user.isAdmin === true) {
//       Product.findById(id ,(err ,product) => {
//         res.render('editProduct' ,{product :product})
//       })
//     }
//   })

// })

router.get('/:id/edit',auth.isAdmin ,(req ,res) =>{
  var id =req.params.id;
  Product.findById(id ,(err ,product) => {
    res.render('editProduct' ,{product :product})
  })
})

router.post('/:id/edit' ,(req ,res) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id ,req.body,(err ,updateProduct) => {
    console.log(updateProduct ,"update product")
    res.redirect('/product')
  })
})

// deldte by admin

// router.get('/:id/delete',(req ,res) =>{
//   var userID = req.session.userID;
//   var id = req.params.id;
//   console.log(userID ,"user id")
//   console.log(id ,"id")
//   User.findById(userID ,(err ,user) => {
//     console.log(user)
//     if(user.isAdmin === true) {
//       Product.findByIdAndDelete(id ,(err ,delProduct) => {
//         console.log(err ,delProduct)
//         res.redirect('/product')
//       })
//     }
//   })
// })

router.get('/:id/delete', auth.isAdmin,(req,res) => {
   var id = req.params.id;
   Product.findByIdAndDelete(id ,(err ,delProduct) => {
    console.log(err ,delProduct)
    res.redirect('/product')
  })
})

// likes by user


// router.get('/:id/likes' ,(req ,res) => {
//   var id = req.params.id;
//   var userID = req.session.userID;
//   User.findById(userID ,(err ,user) => {
//     console.log(user.isAdmin ,"likes user")
//     if(user.isAdmin === false) {
//       Product.findByIdAndUpdate(id ,{$inc : {likes : 1}} ,(err ,uplikes) => {
//         console.log(uplikes ,"update likes")
//       })
//       res.redirect('/product')
//     }
//   })
// })

router.get('/:id/likes',auth.isUser ,(req ,res) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id ,{$inc : {likes : 1}} ,(err ,uplikes) => {
    console.log(uplikes ,"update likes")
    res.redirect('/product')
  }) 
})


// deslike by user
// router.get('/:id/dislikes' ,(req ,res) => {
//   var id = req.params.id;
//   var userID = req.session.userID;
//   User.findById(userID ,(err ,user) => {
//     //console.log(user,"deslikes user")
//     if(user.isAdmin === false ) {
//       Product.findById(id ,(err ,uplikes) => {
//         if(uplikes.likes > 0){
//          Product.findByIdAndUpdate(id ,{$inc : {likes : -1}} ,(err ,updateProduct) => {
//           console.log(uplikes ,"down likes")
//           res.redirect('/product')
//          })
//         } else {
//           res.redirect('/product')
//         }
//       })
//     } 
//   })
// })
router.get('/:id/dislikes', auth.isUser,(req ,res) => {
  var id = req.params.id;
  Product.findById(id ,(err ,uplikes) => {
    if(uplikes.likes > 0){
     Product.findByIdAndUpdate(id ,{$inc : {likes : -1}} ,(err ,updateProduct) => {
      console.log(uplikes ,"down likes")
      res.redirect('/product')
     })
    } else {
      res.redirect('/product')
    }
  })
})

// router.get('/:id/wishlist' ,(req ,res) => {
//   var wishlist =[];
//   var id = req.params.id;
//   var userID = req.session.userID;
//   User.findById(userID ,(err ,user) =>{
//     if(user.isAdmin === false) {
//        Product.findById(id ,(err ,product) => {
//          wishlist.push(product);
//       //res.render('wishList' ,{wishlist :wishlist})
//       res.redirect('/product')
//           console.log(wishlist)
//        })
//     }
//   })
// })

router.get('/:id/wishlist' ,(req ,res) => {
  var id = req.params.id;
  var userID = req.session.userID;
  User.findById(userID ,(err ,user) =>{
    if(user.isAdmin === false) {
       Product.findById(id ,(err ,pro) => {
         var wishObj ={}
         wishObj.title = pro.title;
         wishObj.quantity =pro.quantity;
         wishObj.likes = pro.likes;
         wishObj.price = pro.price;
         wishObj.userID =userID;
         console.log(pro,"wish list")
         WishList.create(wishObj ,(err ,wishListp) => {
           console.log(wishListp ,"wish")
           res.redirect('/product')
         })
      
       })
    }
  })
})

// User wishList

router.get('/userWishList' ,(req ,res) =>{
  var userID = req.session.userID;

  WishList.find({userID :userID} ,(err ,product) => {
    res.render('wishList' ,{product : product})
  })
})

// remove from wishlist

router.get('/:id/del' ,(req ,res) =>{
  var id = req.params.id;
  WishList.findByIdAndDelete(id ,(err,delp) =>{
    console.log(err ,delp)
    res.redirect('/product/userWishList')
  })
})

router.get('/:id/addCart' ,(req ,res) => {
  var id = req.params.id;
  var userID = req.session.userID;
  User.findById(userID ,(err ,user) => {
    if(user.isAdmin === false) {
      Product.findById(id ,(err ,pro) => {
        var cart ={}
        cart.title = pro.title;
        //cart.quantity =pro.quantity;
        cart.likes = pro.likes;
        cart.price = pro.price;
        cart.userID =userID;
        console.log(pro,"cart list list")
        Cart.create(cart ,(err ,wishListp) => {
          Product.findByIdAndUpdate(id ,{$inc : { quantity : -1}} ,(err,updateqty) => {
            console.log(updateqty)
          })
          console.log(wishListp ,"wish")
          res.redirect('/product')
        })
     
      })
    }
  })
})

router.get('/cartList' ,(req ,res) =>{
  var userID = req.session.userID;
  Cart.find({userID : userID} ,(err ,product) => {
    let fitlerP = product.filter((p,i) => p.title);
   // console.log(fitlerP ,"filter")
    res.render('cart' ,{product : product})
  })
})

// remove product fron the cart list
router.get('/:id/remove' ,(req ,res) =>{
  var id = req.params.id;
  Cart.findByIdAndDelete(id ,(err,delp) =>{
    console.log(err ,delp)
    res.redirect('/product/cartList')
  })
})
module.exports = router;