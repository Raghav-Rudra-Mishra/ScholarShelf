const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

//add book to favorites
router.put("/add-book-to-favorites",authenticateToken,async (req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavorite = userData.favorites.includes(bookid);
        if(isBookFavorite) return res.status(200).json({message:"Book is already in favorites!"});
        await User.findByIdAndUpdate(id,{$push:{favorites:bookid}});
        return res.status(200).json({message:"Book added in favorites!"});
    }catch(error){
        return res.status(500).json({message:"Internal server error!"});
    }
});

//delegte book from favorites
router.put("/delete-book-from-favorites",authenticateToken,async (req,res)=>{
    try{
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavorite = userData.favorites.includes(bookid);
        if(isBookFavorite){
            await User.findByIdAndUpdate(id,{$pull:{favorites:bookid}});
        }
        return res.status(200).json({message:"Book deleted from favorites!"});
    }catch(error){
        return res.status(500).json({message:"Internal server error!"});
    }
});

//get-favorite-books-of-a-particular-user
router.get("/get-favorite-books-of-a-particular-user", authenticateToken, async(req,res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favorites");
        const favoriteBooks = userData.favorites;
        return res.json({status:"Success",data:favoriteBooks});
    }catch(error){
        return res.status(500).json({message:"Internal server error occurred!"});
    }
});

module.exports = router;