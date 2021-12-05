const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productHandler = require("./routes/productHandler");
const usrHandler = require("./routes/userHandler");
const app = express();
dotenv.config();
const port = 3000;
app.use(express.json());

// Database connection with mongoose 
mongoose.connect("mongodb://localhost/products")
    .then( () => console.log("database connected successfully"))
    .catch( (err) => consolo.log(err))

// application routes
app.use('/product', productHandler);
app.use('/user', usrHandler);

// Default error handler
const errorHandler = (err, req, res, next) => {
    if(req.headersSent) {
        return next(err)
    }
    res.status(500).json({error: err})
}
app.use(errorHandler);

app.listen(port , () => console.log('Port is running at 3000'))