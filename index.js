require("dotenv").config();
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./db');
const cookieParser = require("cookie-parser");
const logger = require('./logger')

const UserRouter = require('./routes/userRouter')


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin: "https://gruppur.onrender.com",  // Set this explicitly, do NOT use "*"
    credentials: true,  // Required for cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
  
// Handle preflight requests explicitly
app.options("*", cors());
app.use(cookieParser());
connectDB();

app.use('/user', UserRouter)

app.get('/', (req, res) => {
    logger.info("Running Server with port 5000");
    res.send('Hello From Grupp');
});
  
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
  