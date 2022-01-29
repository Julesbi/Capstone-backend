const router=require('express').Router(); 
const bcrypt = require('bcryptjs/dist/bcrypt');
const User =require('../model/User');
const jwt=require('jsonwebtoken');
const{registerValidation,loginValidation} = require('../validation');


router.post('/register',async(req,res)=>{
   //VALIDATING DATA BEFORE REGISTERING USER
   const{error}= registerValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   // check if the user exist already in database
   const emailExist= await User.findOne({email:req.body.email});
   if(emailExist) return res.status(400).send('This email already exists');
   //hashing password
   const salt=await bcrypt.genSalt(10);
   const hashedPassword= await bcrypt.hash(req.body.password,salt);
   // create new user
    const user= new User({
        name:req.body.name,
        email:req.body.email, 
        password:hashedPassword
    });
    try{
       const savedUser= await user.save();
       res.status(200).send({message:"created user successfully", user})
    }catch(err){
        res.status(400).send(err);
    }
}); 
//LOGIN
router.post('/login',async(req,res)=>{
    //validation first
    const{error}= loginValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   //checking if the email exists
   const user= await User.findOne({email:req.body.email});
   if(!user) return res.status(400).send('This email has not signed up');
   //if password is correct 
    const validPass= await bcrypt.compare(req.body.password,user.password);
    if(!validPass)return res.status(400).send('Invalid password')
    
    //create and assigning a token
    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send({message:"logged in successfully", user,token});
    /* res.send('Logged in') */
});
module.exports= router; 