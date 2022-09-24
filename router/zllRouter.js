const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/homepage',(req,res)=>{
    res.render('homepage.html');
})

router.get('/mangereport',(req,res)=>{
    res.render('mangereport.html');
})

router.get('/detail',(req,res)=>{
    res.render('detail.html');
})

router.get('/audit',(req,res)=>{
    res.render('audit.html');
})
router.get('/classify',(req,res)=>{
    res.render('classify.html');
})




module.exports = router;