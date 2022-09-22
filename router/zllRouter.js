const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/homepage',(req,res)=>{
    res.sender('hompage.html');
})