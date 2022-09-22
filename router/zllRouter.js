const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/homepage',(req,res)=>{
    res.render('homepage.html');
})

router.get('/backstage',(req,res)=>{
    res.render('backstage.html');
})




module.exports = router;