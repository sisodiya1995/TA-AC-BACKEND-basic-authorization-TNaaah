var mongoose = require('mongoose');
var schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var wishSchema = new schema({
    title : {type : String , required : true} ,
    quantity : {type : Number , required : true},
    likes : {type : Number } ,
    price :{type : Number , required : true},
    commentID :[{type : schema.Types.ObjectId, ref :"Comment"}] ,
    userID :{type : schema.Types.ObjectId , ref : "User"},
    slug: { type: String, slug: "title" },
    image :{type : String}
},{timestamps : true})

var WishList = mongoose.model('WishList' , wishSchema)
module.exports = WishList;
