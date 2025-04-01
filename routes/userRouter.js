const express = require('express')
const mongoose = require('mongoose')
const User = require('../schemas/userSchema')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middlewares/authMiddleware');
const logger = require('../logger')

const router = express.Router();

// const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: "Access Denied" });
  
//     try {
//       const verified = jwt.verify(token, process.env.JWT_SECRET);
//       console.log('User Verified', verified)
//       req.user = verified;
//       next();
//     } catch (err) {
//       res.status(400).json({ message: "Invalid Token" });
//     }
// };

router.post("/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      token && logger.info("User Login Detectected", token, user._id);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
      res.json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
});

router.get('/all', async (req, res) => {
    try{
        console.log('Get All Users')
        const users = await User.find({})
        res.send(users)
    }
    catch(err){
        console.log(err)
    }
})
router.get('/get', async (req, res) => {
    try{
        const user = req.body.userId;
        const users = await User.find({"userId" : user})
        res.send(users)
    }
    catch(err){
        console.log(err)
    }
})
router.post('/signin', async (req, res) => {
    try{
        console.log(req.body)
        const email = req.body.email;
        const password = req.body.password
        const users = await User.find({"email" : email, "password" : password})
        res.send(users)
    }
    catch(err){
        console.log(err)
    }
})
router.post('/create', async (req, res) => {
    try {
        const user = req.body;
        const newUser = new User(req.body)
        newUser.save();
        res.send(user)
    } catch (error) {
       res.send(error)
    }
})

module.exports = router;