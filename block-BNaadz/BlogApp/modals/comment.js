var mongoose = require("mongoose");
var schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

var commentSchema = new schema(
  {
    title: String,
    author: String,
    likes: { type: Number, default: 0 },
    articleID: { type: schema.Types.ObjectId, ref: "Article" },
    slug: { type: String, slug: "title" },
    articleSlug: { type: String },
    loggeduserID : {type :schema.Types.ObjectId ,ref:'User', required : true},  
  },
  { timestamps: true }
);

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
