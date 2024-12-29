const router = require("express").Router();
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
      const { id } = req.headers;
      const { order } = req.body;
  
      for (const orderData of order) {
        const newOrder = new Order({ user: id, book: orderData._id });
        const orderDataFromDb = await newOrder.save();
  
        // Saving Order in user model
        await User.findByIdAndUpdate(id, {
          $push: { orders: orderDataFromDb._id },
        });
  
        // Clearing cart
        await User.findByIdAndUpdate(id, {
          $pull: { cart: orderData._id },
        });
      }
  
      return res.json({
        status: "Success",
        message: "Order Placed Successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred!" });
    }
});

router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path:"orders",
            populate:{path:"book"}
        });
        const orderData = userData.orders.reverse();
        return res.json({
            status: "Success",
            data:orderData
        });
    }catch (error) {
        return res.status(500).json({ message: "An error occurred!" });
    }
});

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  console.log("Route /get-all-orders hit");
  try {
      const userData = await Order.find().populate({ path: "book" }).populate({ path: "user" }).sort({ createdAt: -1 });
      console.log("userData order", userData);
      return res.json({ status: "Success", data: userData });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred!" });
  }
});

router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({status:"Success",message:"Status updated successfully!"});
    }catch (error) {
        return res.status(500).json({ message:"An error occurred!"});
    }
});
 
module.exports = router;