const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.get('/layout',(req,res)=>{
    res.render('layout.html')
})
router.get('/Personalhomepage',(req,res)=>{
    res.render('Personalhomepage.html')
})
router.get('/login',(req,res)=>{
    res.render('login.html')
})
router.get('/register',(req,res)=>{
    res.render('register.html')
})
router.get('/register2',(req,res)=>{
    res.render('register2.html')
})
axios.defaults.baseURL = 'http://152.136.99.236:8080/'
//发送验证码
router.post('/api/sendcode', (req, res) => {    
    var mailLimit = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var mailJudge = mailLimit.test(req.body.mail);
    if (mailJudge==false){
        res.send({ err: -1, msg:'邮箱形式错误'});
    }else{
        axios({
            url:'/loginAndRegister/sendMail',
            method:'post',
            params:req.body,
        }).then(response=>{
            console.log(response.data);
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:"OK"});
            }else if(response.data.msg=='已有该用户'){
                res.send({ err: -1, msg:'已有该用户'});
            }else{
                res.send({ err: -1, msg:'数据操作错误'});
            }
        }).catch(function (error) {
            console.log(error);
            res.send({ err: -1, msg: '网络错误' })
        });
    }
})
//检查验证码
router.post('/api/checkcode', (req, res) => {    
    var mailLimit = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var mailJudge = mailLimit.test(req.body.mail);
    if (mailJudge==false){
        res.send({ err: -1, msg:'邮箱形式错误'});
    }else{
        axios({
            url:'/loginAndRegister/checkCode',
            method:'post',
            params:req.body,
        }).then(response=>{
            console.log(response.data);
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:"OK"});
            }else{
                res.send({ err: -1, msg:'数据操作错误'});
            }
        }).catch(function (error) {
            console.log(error);
            res.send({ err: -1, msg: '网络错误' })
        });
    }
})
//注册
router.post('/api/register', (req, res) => {    
    axios({
        url:'/loginAndRegister/register',
        method:'post',
        params:req.body,
    }).then(response=>{
        console.log(response.data);
        if(response.data.msg=='OK'){
            res.send({ err: 0, msg:"OK"});
        }else{
            res.send({ err: -1, msg:'数据操作错误'});
        }
    }).catch(function (error) {
        console.log(error);
        res.send({ err: -1, msg: '网络错误' })
    });
    
})
module.exports=router;

