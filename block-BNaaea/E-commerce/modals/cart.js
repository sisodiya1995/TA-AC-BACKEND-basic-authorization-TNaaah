var mongoose = require('mongoose');
var schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Cart = require('../modals/cart')

var cartSchema = new schema({
    title : {type : String , required : true} ,
    quantity : {type : Number , default : 1},
    likes : {type : Number } ,
    price :{type : Number , required : true},
    commentID :[{type : schema.Types.ObjectId, ref :"Comment"}] ,
    userID :{type :schema.Types.ObjectId ,ref : 'User'} ,
    slug: { type: String, slug: "title" },
    image :{type : String}

},{timestamps : true})


cartSchema.pre('save' ,function(next){
//console.log(this ,"cart this")
    Cart.find({} ,(err ,carts) =>{
        var allNams =carts.map((p) => p.title)
        console.log(allNams)
        //console.log(carts.includes(this))
     if(allNams.includes(this.title)) {
       Cart.findOneAndUpdate({title : this.title},{$inc :{quantity : 1}} ,(err ,upQty) =>{
        return  next()
       })
        
     } else {
          
         next();
     }
 })

})
var Cart = mongoose.model('Cart' , cartSchema)
module.exports = Cart;