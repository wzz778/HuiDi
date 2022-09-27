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
router.get('/repassword',(req,res)=>{
    res.render('repassword.html')
})
router.get('/repassword2',(req,res)=>{
    res.render('repassword2.html')
})
axios.defaults.baseURL = 'http://152.136.99.236:8080/'
//登录
router.post('/api/login', (req, res) => {    
    axios({
        url:'/loginAndRegister/login',
        method:'post',
        params:req.body,    
    }).then(response=>{
        console.log(response.data);
        if(response.data.msg=='OK'){
            req.session.token=response.data.data.token;
            req.session.userid=jwt.decode(req.session.token).id;
            req.session.username=jwt.decode(req.session.token).username;
            res.send({ err: 0, msg:"OK"});
        }else{
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        console.log(error);
        res.send({ err: -1, msg: '网络错误' })
    });
})
//发送验证码(查重)
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
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            console.log(error);
            res.send({ err: -1, msg: '网络错误' })
        });
    }
})
//发送验证码(不查重)
router.post('/api/resendcode', (req, res) => {    
    var mailLimit = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var mailJudge = mailLimit.test(req.body.email);
    console.log(req.body);
    if (mailJudge==false){
        res.send({ err: -1, msg:'邮箱形式错误'});
    }else{
        axios({
            url:'/loginAndRegister/sendRetrieveMail',
            method:'post',
            params:req.body,
        }).then(response=>{
            console.log(response.data);
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:"OK"});
            }else{
                res.send({ err: -1, msg:response.data.msg});
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
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        console.log(error);
        res.send({ err: -1, msg: '网络错误' })
    });
    
})
//修改密码
router.post('/api/updatepassword', (req, res) => {
    axios({
        method: 'PUT',
        url: '/loginAndRegister/retrievePassword',
        params: req.body,
    }).then((result) => {
        if (result.data.msg == 'OK') {  
            res.send({ err: 0, msg: result.data })
        } else {
            res.send({ err: -1, msg: result.data })
        }
    }).catch((err) => {
        // console.log(err.data)
        res.send({ err: -1, msg: err })
    })
})
//获取个人信息
router.get('/api/getmymessage', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/showUser',
            method:'get',  
            params:{
                id:req.session.userid
            },    
        }).then(response=>{ 
            console.log(response.data);
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
})
module.exports=router;

