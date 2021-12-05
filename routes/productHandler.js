const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const productSchema = require("../schemas/productSchema");
const checkLogin = require("../middlewares/checkLogin");
// create model
const Product = mongoose.model('Product', productSchema);
// routes
// get all products
router.get('/',  async (req, res) => {
    try {
        await Product.find({status: 'inactive'})
        .select({
            _id: 0,
            __v: 0,
            date: 0
        })
        .limit(2)
        .exec( (err, data) => {
            if(err) {
                res.status(500).json({"error": "There was a serverside error"})
            } else {
                res.status(200).json({
                    result: data,
                    "message": "successfully displayed all products"
                })
            }
        })
    } catch (err) {
        res.status(500).json({"error": err})
    }
});

// get a product
router.get('/:id', async (req, res) => {
    await Product.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'There was a serverside error' });
        } else {
            res.status(200).json({
                result: data,
                message: 'successfull',
            });
        }
    }).clone().catch( (err) => console.log(err));
});

// post a product
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save( (err) => {
        if(err) {
            res.status(500).json({
                "error": "There was a serverside error"
            })
        } else {
            res.status(200).json({
                "message": "Product posted successfully"
            })
        }
    })
});

// post all products
router.post('/all', async (req, res) => {
    Product.insertMany(req.body, (err) => {
        if(err) {
            res.status(500).json({
                "error": "There was a serverside error"
            })
        } else {
            res.status(200).json({
                "message": "Multiple Products posted successfully"
            })
        }
    })
});

// put  products
router.put('/:id', async (req, res) => {});

// delete  products
router.delete('/', async (req, res) => {});

module.exports = router