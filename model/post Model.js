const mongoose= require('mongoose');
const Schema= mongoose.Schema({
    title:{type:String},
    content:{type:String},
    imageUrl:{type:String},
    cloudinaryId:{type:String}
},
{timestamps:true})
const post= mongoose.model('post',Schema);
module.exports=post;