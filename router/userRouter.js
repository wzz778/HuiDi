const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
axios.default.baseURL = 'http://110.40.205.103:8099/';
router.get('/layout',(req,res)=>{
    res.render('layout.html')
})
router.get('/Personalhomepage',(req,res)=>{
    res.render('Personalhomepage.html')
})
router.get('/login',(req,res)=>{
    res.render('login.html')
})
module.exports=router;

