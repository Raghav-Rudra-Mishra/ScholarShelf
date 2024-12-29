const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
// Sign-Up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be at least 4" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must have at least 6 characters!" });
        }

        // Create and save new user
        const newUser = new User({
            username: username,
            email: email,
            password: password, // Password saved as plaintext
            address: address
        });

        await newUser.save();
        return res.status(200).json({ message: "Signed Up successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Sign-In
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "User doesn't exist!" });
        }

        // Compare passwords directly
        if (password === existingUser.password) {
            const authClaims = [
                {name:existingUser.username},
                {role:existingUser.role},
            ]
            const token = jwt.sign({authClaims},"bookstore123",{expiresIn: "30d",});/*secret key*/
            return res.status(200).json({id:existingUser._id, role:existingUser.role, token:token });
        } else {
            return res.status(400).json({ message: "Invalid Password!" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//get user information
router.get("/get-user-info",authenticateToken, async(req,res)=>{
    try{
        console.log("Headers:", req.headers);
        const {id} = req.headers;
        console.log("id:",id);
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);
    }catch(error){
        console.error("Error in getting user information:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//update address
router.put("/update-user-info",authenticateToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        console.log("id:",id);
        const {address} = req.body;
        console.log("address:",address);
        await User.findByIdAndUpdate(id, {address:address});
        return res.status(200).json({message:"Address updated Successfully!"});
    }catch(error){
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
