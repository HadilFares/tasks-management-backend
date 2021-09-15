const router = require ('express').Router();
const UserModel =require('../models/User');
const {registreValidation,loginValidation}=require ('./validation');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const dotenv = require("dotenv");

router.post('/register',async(req,res)=>{
    //lets validate the data before we a user 
   const {error}= registreValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);
    //EMAIL DOESN'T EXIST
  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already exists");
  // hash the passwords 
  const salt =await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt);
 try {
   const  {
        name,lastname,email,password,verifPassword
    } = req.body;

    if (password != verifPassword)
        return res.status(400).json({"msg" : "passsword not valid"})

    const user=new UserModel({
        name:req.body.name,
        lastname:req.body.lastname,
        email:req.body.email,
        password:hashedPassword,
    });
        const savedUser= await user.save();
        res.send({user:savedUser_id});

    }catch (err){
        res.status(400).json(err);
    }
});

router.post('/login',async (req,res)=>{
    //validate the data 
    const {error}=loginValidation(req.body);
    if (error)return res.status(400).send(error.details[0].message);
    //Email doesn't exist 
    const user=await UserModel.findOne({email:req.body.email});
    if (!user) return res.status(400).send("email or password doesn't exists");
    //check the password 
    const validPassword =await bcrypt.compare(req.body.password,user.password);
  if (!validPassword) return res.status(400).send("Invalide password");
    //create token 
    const token =jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header("auth-token",token).send(token);
});
router.get("/logout",async(req,res)=>{
    req.session.destroy();
});


router.get







module.exports=router;