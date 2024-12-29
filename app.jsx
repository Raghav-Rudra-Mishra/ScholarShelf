const express = require('express');
// const mongoose = require('mongoose');
 
const app = express();
require("dotenv").config();
require("./connection/connection.jsx");
const User = require("./routes/user.js");
const Books = require("./routes/book.js");
const favorites = require("./routes/favorites.js");
const cart = require("./routes/cart.js");
const order = require("./routes/order.js");
const cors = require("cors");

app.use(cors({
    origin: ['https://zingy-sprinkles-3cb376.netlify.app', 'http://localhost:5173'], // Allow requests from frontend
    credentials: true, // Allow cookies if needed
}));

app.use(express.json());
app.use("/api/v1",User);
app.use("/api/v1",Books);
app.use("/api/v1",favorites);
app.use("/api/v1",cart);
app.use("/api/v1",order);

app.listen(process.env.PORT,()=>{
    console.log(`Server started at port ${process.env.PORT}`);
});
