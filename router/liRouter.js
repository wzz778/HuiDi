const express=require('express')
const router=express.Router()
const axios=require('axios')

// 访问页面
// 首页
router.get('/',(req,res)=>{
    res.render('index.html')
})

module.exports = router
