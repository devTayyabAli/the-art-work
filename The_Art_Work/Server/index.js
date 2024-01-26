const express = require("express");
const cors = require("cors");
const cloudinary = require("cloudinary");
// import db connection
const { poolConnect } = require("./connection/db")
// import router
const router = require("./router/router")
const dbConnection = require("./connection/db");
const multer = require("multer");
const path = require('path');
const candidates = require("./models/candidates");
const getReward = require("./controller/distributeRewards");
require('dotenv').config()
const app = express();
app.use(cors());

app.use("/api/v1", router)

let PATH = process.env.PORT || 3344;


getReward()

app.get("/", (req, res) => {
    // res.sendFile('./index.html')
    res.send("server running fine 🏃‍♂️");
});

let server = app.listen(PATH, () => {
    dbConnection();
    console.log(`Marketplace server listening at http://localhost:${PATH}`);
})
process.on('unhandledRejection', error => {
    console.log(error.message);
    server.close(() => process.exit(1));
});