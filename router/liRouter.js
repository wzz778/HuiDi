const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const axios=require('axios')

// 访问页面
// 首页
router.get('/',(req,res)=>{
    res.render('index.html')
})
// 图片分类显示
router.get('/Classification',(req,res)=>{
    res.render('Classification.html')
})
// 专辑图片
router.get('/album',(req,res)=>{
    res.render('album.html')
})
// 动态详情页
router.get('/dynamicDetails',(req,res)=>{
    res.render('dynamicDetails.html')
})
// 搜索详情页
router.get('/search',(req,res)=>{
    res.render('search.html')
})

module.exports = router
