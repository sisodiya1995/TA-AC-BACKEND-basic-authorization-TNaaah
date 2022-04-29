var mongoose = require('mongoose');
var schema = mongoose.Schema;

var podcastSchema = new schema({
  title :{type : String} ,
  artists :{type : String} ,
  song :{type : String},
  podcastPlan : {type : String },
  userID :{type: schema.Types.ObjectId ,ref :"User"}
},{timestamps :true})

var Podcast = mongoose.model('Podcast',podcastSchema);
module.exports =Podcast;