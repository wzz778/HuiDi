const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const axios=require('axios')

// 指定默认请求路径
axios.defaults.baseURL = 'http://152.136.99.236:8080/'

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

router.post('/admin/releaseAlbum',(req,res)=>{
    res.send({err:0,msg:req.session})
})

module.exports = router
