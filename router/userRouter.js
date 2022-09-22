const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
axios.default.baseURL = 'http://110.40.205.103:8099/';
router.get('/layout',(req,res)=>{
    res.render('layout.html')
})
module.exports=router;