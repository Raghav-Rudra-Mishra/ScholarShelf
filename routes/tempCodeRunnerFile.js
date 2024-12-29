const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
//sign up

router.post("/sign-up",async(req,res)=>{
    try{
        const {username,email,password,address} = req.body;
        //check username length is more than 4
        if(username.length < 4){
            return res.status(400).json({message:"Username length should be atleast 4"});
        }
        //check username already exists or not
        const existingUsername = await User.findOne({username:username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists!"});
        }
        //check email already exists or not 
        const existingEmail = await User.findOne({email:email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists!"});
        }
        //check password length is atleast 6
        if(password.length<6){
            return res.status(400).json({message:"Password must have atleast 6 characters!"});
        }

        const hashPass = await bcrypt.hash(password, 10);
        console.log("Hashed Password:", hashPass); // Debug log
        //User is a valid user now
        const newUser = new User({
            username:username, 
            email:email,
            password:hashPass,
            address:address
        });

        await newUser.save();
        return res.status(200).json({message:"Signed Up successfully"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
})
module.exports = router;