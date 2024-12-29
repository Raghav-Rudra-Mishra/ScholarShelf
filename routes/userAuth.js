const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log("Authenticating token...");
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token received:", token);

    if(token == null){
        return res.status(401).json({message:"Authentication token required"});
    }

    jwt.verify(token,"bookstore123", (err,user)=>{
        if(err){
            console.error("JWT Verification Error:", err);
            return res.status(403).json("Session expired, please signin again.");
        }
        console.log("Verified user:", user);
        req.user = user;
        next();
    });
};


module.exports = {authenticateToken};