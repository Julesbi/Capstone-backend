const router= require('express').Router();
const verify=require('./verifyToken');
const cloudinary = require("../config/cloudinary");
const multerMiddleware = require("../middleware/multer");
const postModel= require('../model/post Model');

// router.get('/',verify,(req,res)=>{
//     res.json({
//         posts:{
//             title:'my first blog',
//             description:'even if you are broken do not be broken of ideas'
//         }
//     });
// });
router.post('/',multerMiddleware.single("image"),async(req,res)=>{
    const results = await cloudinary.uploader.upload(req.file.path);
const {title,content}=req.body;
try {
    const newPost= await postModel.create({title,content,imageUrl:results.url, cloudinaryId:results.public_id});
    res.json(newPost)
} catch (error) {
    res.sendStatus(500).send(error)
    
}
});
router.get('/',async(req,res)=>{
    try {
        const posts= await postModel.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error)
    }
});
//get one post
router.get('/:id',async(req,res)=>{
    const {id}= req.params;
    try {
        const post= await postModel.findById(id);
        res.json(post);
    } catch (error) {
        res.status(500).send(error)
        
    }
})
// update
router.put('/:id',multerMiddleware.single("image"),async(req,res)=>{
    try {
        const{id}=req.params;
        const{title,content}=req.body;
        const foundPost= await postModel.findById(id);
        await cloudinary.uploader.destroy(foundPost.cloudinaryId);
        const results = await cloudinary.uploader.upload(req.file.path);
        const data = {
            title: req.body.title || foundPost.title,
            content:req.body.content || foundPost.content,
            imageUrl:results.url || foundPost.imageUrl,
            cloudinaryId:results.public_id || foundPost.cloudinaryId
        }
        const post= await postModel.findByIdAndUpdate(id,data);
        
        res.json(post)
    } catch (error) {
        res.status(500).send(error)
    }
})
//delete
router.delete('/:id',async(req,res)=>{
    const{id}=req.params;
    try {
        const post= await postModel.findById(id);
        await cloudinary.uploader.destroy(post.cloudinaryId)
        await post.remove();
        res.json({message:'Deleted successfully'})
    } catch (error) {
        res.status(500).send(error)
    }
})
module.exports= router;