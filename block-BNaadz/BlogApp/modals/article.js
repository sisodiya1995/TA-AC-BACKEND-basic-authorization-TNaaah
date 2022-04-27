var mongoose = require("mongoose");
var schema = mongoose.Schema;
var slug = require("mongoose-slug-generator");
mongoose.plugin(slug)
//var User = require('../modals/user')

var articleSchema = new schema(
  {
    title: String,
    description: String,
    likes: { type: Number, default: 0 },
    commentID: [{ type: schema.Types.ObjectId, ref: "Comment" }],
    author: String,
    authorname :{type :schema.Types.ObjectId ,ref :"User" ,required : true},
    slug: { type: String, slug: "title" },
  },
  { timestamps: true }
);

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;
