const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
// create model 
const User = mongoose.model("User", userSchema);

// routes 
//signup
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(200).json({
            message: 'Signup was successfull',
        });
    } catch {
        res.status(500).json({
            error: 'Signup failed !',
        });
    }
    
})
//signin
router.post('/signin', async (req, res) => {
  try {
      const user = await User.find({username: req.body.username})
      if(user && user.length > 0) {
        const isPasswordValid = await bcrypt.compare(req.body.password, user[0].password);
        if(isPasswordValid) {
            // valid token
            const token = jwt.sign(
                {
                    username: user[0].username,
                    userId: user[0]._id
                },
                process.env.TOKEN_SECRATE,
                {expiresIn: '1h'}
            );
            res.status(200).json({
                access_token: token,
                message: "successfully signin"
            })
        }
      } else {
        res.status(401).json({
            error: 'Authentication failed',
        });
      }

  } catch {
    res.status(401).json({
        error: 'Authentication failed',
    });
  }
});
module.exports = router;