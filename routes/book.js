const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const {authenticateToken} = require("./userAuth");

//add book --admin
router.post("/add-book",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const user = await User.findById(id);
        if(user.role!=="admin"){
            return res.status(400).json({message:"you are not having access to perform admin operations"});
        }
        const book = new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price: req.body.price,
            desc:req.body.desc,
            language:req.body.language
        });

        await book.save();
        return res.status(200).json({message:"Book added successfully!"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error!"});
    }
});

//update-book --admin
router.put("/update-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price: req.body.price,
            desc:req.body.desc,
            language:req.body.language
        });
        
        return res.status(200).json({message:"Book updated successfully!"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"An error occurred!"});
    }
});

//delete-book --admin
router.put("/delete-book",authenticateToken,async(req,res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Book deleted successfully!"});
    }catch(error){
        return res.status(500).json({message:"An error occurred!"});
    }
});

//get all books
router.get("/get-all-books",async (req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1});
        return res.json({status:"Success",data:books});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred!"});
    }
});

//get-recent-books-all-limit-to-4
router.get("/get-recent-books", async (req,res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1}).limit(10);
        return res.json({status:"Success",data:books});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred!"});
    }
});

//particular book detail
router.get("/get-book/:id",async(req,res)=>{
    try{ 
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.status(200).json({status:"Success", data:book});
    }catch(error){
        console.error("Error",error);
        return res.status(500).json({message:"An error occurred!"});
    }
});
module.exports = router;