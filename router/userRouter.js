const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();
const FormData=require('form-data');
const fs=require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
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
router.get('/modifymessage',(req,res)=>{
    res.render('modifymessage.html')
})
router.get('/reemail',(req,res)=>{
    res.render('reemail.html')
})
router.get('/mymessage',(req,res)=>{
    res.render('mymessage.html')
})
router.get('/userhomepage',(req,res)=>{
    res.render('userhomepage.html')
})
axios.defaults.baseURL = 'http://152.136.99.236:8080/'
function saveUserInfo(id){
    return new Promise((resolve,resject)=>{
        axios({
            method:'GET',
            url:'/picture/showUser',
            params:{
                id:id
            }
        })
        .then(result=>{
            resolve(result)
        })
        .catch(err=>{
            resject()
        })
    })
}
function sendLogin(obj,req){
    return new Promise((resolve,resject)=>{
        axios({
            method:'POST',
            url:'/loginAndRegister/login',
            params:obj
        })
        .then(result=>{
            if(result.data.msg=='OK'){
                req.session.token=result.data.data.token;
                console.log(result.data.data.token);
                req.session.userid=jwt.decode(req.session.token).id;
                req.session.username=jwt.decode(req.session.token).username;
                resolve(result.data)
            }else{
                resject({ err: -1, msg:result.data.msg})
            }
        })
        .catch(err=>{
            resject(err)
        })
    })
}
router.post('/api/login',(req,res)=>{
    sendLogin(req.body,req)
    .then(result=>{
        return saveUserInfo(req.session.userid)
    })
    .then(result=>{
        req.session.user=result.data.data;
        res.send({ err: 0, msg:"OK"});
    })
    .catch(err=>{
        console.log(err)
        res.send({ err: -1, msg: '网络错误' })
    })
})
//登录
// router.post('/api/login', (req, res) => {    
//     axios({
//         url:'/loginAndRegister/login',
//         method:'post',
//         params:req.body,    
//     }).then(response=>{
//         console.log(response.data);
//         if(response.data.msg=='OK'){
//             req.session.token=response.data.data.token;
//             req.session.userid=jwt.decode(req.session.token).id;
//             req.session.username=jwt.decode(req.session.token).username;
//             console.log(req.session.token);
//             console.log(jwt.decode(req.session.token));
//             res.send({ err: 0, msg:"OK"});
//             return     axios({
//                 url:'/picture/showUser',
//                 method:'get',
//                 params:{id:req.session.userid},
//             })
//         }else{
//             res.send({ err: -1, msg:response.data.msg});
//         }
//     }).then(user=>{
//         req.session.user=user.data.data;
//         console.log("__________________________");
//         console.log(req.session.user)
//         console.log("__________________________");
//         // res.send(req.session.user)
//     }).catch(function (error) {
//         console.log(error);
//         res.send({ err: -1, msg: '网络错误' })
//     });
// })
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
            // console.log(response.data);
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
            // console.log(response.data);
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
            // console.log(response.data);
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
            url:'/picture/showUser',
            method:'get',  
            params:{
                id:req.session.userid
            },    
        }).then(response=>{ 
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            // console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
})
//获取用户信息
router.get('/api/getusermessage', (req, res) => {   
    console.log(req.query );
        axios({
            url:'/picture/showUser',
            method:'get',  
            params:req.query 
        }).then(response=>{ 
            // console.log(response);
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
})
//获取个人的粉丝和关注数
router.get('/api/getmynumber', (req, res) => {   
        axios({
            url:'/picture/showOtherFocus',
            method:'get',  
            params:{
                id:req.session.userid
            },    
        }).then(response=>{ 
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        }); 
})
//获取他人的粉丝和关注数
router.get('/api/getusernumber', (req, res) => {   
    axios({
        url:'/picture/showOtherFocus',
        method:'get',  
        params:{
            id:req.query.id
        }
    }).then(response=>{ 
        if(response.data.msg=='OK'){
            res.send({ err: 0, msg:response.data.data});
        }else{
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        console.log(error.response);
        res.send({ err: -1, msg: '网络错误' })
    });
})
//获取个人的专辑名
router.get('/api/getmyalbumname', (req, res) => {   
    axios({
        url:'picture/showAlbum',
        method:'get',  
        params:{
            id:req.session.userid,
        }
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
})
//获取他人的专辑名
router.get('/api/getuseralbumname', (req, res) => {   
    axios({
        url:'picture/showAlbum',
        method:'get',  
        params:{
            id:req.query.id
        }
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
})
//显示个人动态
router.get('/api/getmydynamic', (req, res) => {   
    axios({
        url:'/picture/getPersonInfo',
        method:'get',  
        params:{
            size:req.query.size,
            id:req.session.userid,
            begin:req.query.begin
        }
    }).then(response=>{ 
        if(response.data.msg=='OK'){
            res.send({ err: 0, msg:response.data.data});
        }else{
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        console.log(error.response);
        res.send({ err: -1, msg: '网络错误' })
    });
})
//显示用户动态
router.get('/api/getuserdynamic', (req, res) => {   
    axios({
        url:'/picture/getPersonInfo',
        method:'get',  
        params:{
            size:req.query.size,
            id:req.query.id,
            begin:req.query.begin
        }
    }).then(response=>{ 
        if(response.data.msg=='OK'){
            res.send({ err: 0, msg:response.data.data});
        }else{
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        console.log(error.response);
        res.send({ err: -1, msg: '网络错误' })
    });
})
///发布专辑
router.post('/api/addalbum', (req, res) => {
    axios({
        method: 'post',
        url: '/admin/releaseAlbum',
        params:{
            u_id:req.session.userid,
            album:req.body.album,
            describes:req.body.describes,
            types:req.body.types,
        },
        headers:{
            token:req.session.token,
        }
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
//发布动态
router.post('/api/Releasedynamics', multipartMiddleware,(req, res) => {
    let formdata = new FormData()
    //建立FormData()对象，注意：node中使用要先下载formdata中间件
    for (let a in req.files) {
        formdata.append('files', fs.createReadStream(req.files[a].path),req.files[a].originalFilename)//第二个参数试上传的文件名
    }
    //循环传递file文件对象，req.files[a].path是该文件的本地地址， 用fs.createReadStream(req.files[a].path)进行读取创作，req.files[a].originalFilename是文件本名，用来传出文件名称
    formdata.append('describes',req.body.describes)
    formdata.append('al_id',req.body.al_id)
    console.log(formdata);
    //req.body中传递非文件数据， req.files是文件数据
    axios({
        method: 'POST',
        url: 'admin/releaseImage',
        data:formdata,
        // headers: formdata.getHeaders(),
        headers:{
            token:req.session.token,
            // token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ1MTU1OTUsImV4cCI6MTY2NDUxOTE5NSwiaWQiOjUsInVzZXJuYW1lIjoiMjI5NTkwODI1MUBxcS5jb20iLCJwb3dlciI6IlsvYWRtaW4vKiosIFJvbGVfYWRtaW5dIn0.T5Boi7cRZHidNCSnKPkenLKZFwITWgoSOMsobIIbYAE',
            formdata:formdata.getHeaders(),//传递formdata数据
            maxBodyLength:1000000000
        }
    })
    .then((result) => {
        // console.log(result.data)
        res.send({ err: 0, msg: result.data })
    })
    .catch((err) => {
        // console.log(err)
        res.send({ err: -1, msg: err})
    })
})  
//关注
router.post('/api/addfollow', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/addFocus',
            method:'post',  
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid,
                focus_id:req.body.userid,
            },    
        }).then(response=>{ 
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            // console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
})
router.get('/api/deletefollow', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/deleteFocus',
            method:'delete',  
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid,
                focus_id:req.query.userid,
            },    
        }).then(response=>{ 
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            // console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
})
//检查是否互相关注
router.get('/api/inspectfollow', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/checkFocus',
            method:'get',  
            headers:{
                token:req.session.token,
            },
            params:{
                focus_id:req.session.userid,
                u_id:req.query.userid,
            },    
        }).then(response=>{ 
            if(response.data.msg=='OK'){
                res.send({ err: 0, msg:response.data.data});
            }else{
                res.send({ err: -1, msg:response.data.msg});
            }
        }).catch(function (error) {
            // console.log(error.response);
            res.send({ err: -1, msg: '网络错误' })
        });
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
})
module.exports=router;

