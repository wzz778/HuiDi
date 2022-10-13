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
router.get('/MyFollowers',(req,res)=>{
    res.render('MyFollowers.html')
})
router.get('/Myfans',(req,res)=>{
    res.render('Myfans.html')
})
router.get('/chatmessage',(req,res)=>{
    res.render('chatmessage.html')
})
router.get('/likemessage',(req,res)=>{
    res.render('likemessage.html')
})
router.get('/collectmessage',(req,res)=>{
    res.render('collectmessage.html')
})
router.get('/focusmessage',(req,res)=>{
    res.render('focusmessage.html')
})
router.get('/commentmessage',(req,res)=>{
    res.render('commentmessage.html')
})
router.get('/chat',(req,res)=>{
    res.render('chat.html')
})
axios.defaults.baseURL = 'http://152.136.99.236:8080/'
function saveUserInfo(id){
    return new Promise((resolve,reject)=>{
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
            reject()
        })
    })
}
function sendLogin(obj,req){
    return new Promise((resolve,reject)=>{
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
                reject({ err: -1, msg:result.data.msg})
            }
        })
        .catch(err=>{
            reject(err)
        })
    })
}
//登录
router.post('/api/login',(req,res)=>{
    sendLogin(req.body,req)
    .then(result=>{
        return saveUserInfo(req.session.userid)
    })
    .then(result=>{
        req.session.user=result.data.data;
        res.send({ err: 0, msg:result.data.data});
    })
    .catch(err=>{
        console.log(err)
        res.send({ err: -1, msg: '网络错误' })
    })
})
//验证账号
router.get('/api/checkaccount',(req,res)=>{
    if(req.session.user){
        axios({
            method:'POST',
            url:'/loginAndRegister/login',
            params:{
                username:req.session.user.mail,
                password:req.query.password
            }
        })
        .then(result=>{ 
            if(result.data.msg=='OK'){
                res.send({ err: 0, msg:"OK"})
            }else{
                res.send({ err: -1, msg:result.data.msg})
            }
        })
        .catch(err=>{
            res.send({ err: -1, msg:'访问错误'})
        })
    }else{
        res.send({ err: -1, msg:'未登录'})
    }
})
//判断是否是该用户
router.get('/api/isuser',(req,res)=>{
    if(req.session.userid){
        if(req.session.userid==req.query.id){
            res.send({ err: 0, msg: 'true' })
        }
    }else{
        res.send({ err: -1, msg: '未登录' })
    }
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
//退出登录
router.get('/api/outlogin', (req, res) => {
    try {
        req.session.destroy()
        res.send({err: 0, msg:'退出成功'});
    } catch (error) {
        res.send({err: 1, msg:'退出失败'});
    }
        
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
                u_id:req.session.userid
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
            u_id:req.query.id
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
            begin_index:1,
            size:10,
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
        console.log(error);
        res.send({ err: -1, msg: '网络错误' })
    });
})
//获取他人的专辑名
router.get('/api/getuseralbumname', (req, res) => {   
    axios({
        url:'picture/showAlbum',
        method:'get',  
        params:{
            begin_index:req.query.begin,
            size:req.query.size,
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
//显示用户收藏
router.get('/api/getusercollect', (req, res) => {   
    axios({
        url:'/picture/showCollect',
        method:'get',  
        params:{
            size:req.query.size,
            u_id:req.query.id,
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
//显示本人的收藏
router.get('/api/getmycollect', (req, res) => {   
    axios({
        url:'/picture/showCollect',
        method:'get',  
        params:{
            size:req.query.size,
            u_id:req.session.userid,
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
//更改信息
router.post('/api/remymessage', multipartMiddleware,(req, res) => {
    let formdata = new FormData()
    console.log(req.files)
    if(req.files.file!=undefined){
        formdata.append('file', fs.createReadStream(req.files.file.path),req.files.file.originalFilename)//第二个参数试上传的文件名
    }
    if(req.files.background_img!=undefined){
        formdata.append('background_img', fs.createReadStream(req.files.background_img.path),req.files.background_img.originalFilename)//第二个参数试上传的文件名
    }
    formdata.append('sex',req.body.sex)
    formdata.append('describes',req.body.describes)
    // formdata.append('name',req.body.username)
    formdata.append('id',req.session.userid)
    // req.session.userid
    console.log(formdata);
    axios({
        method: 'POST',
        url: '/admin/updateUserPicture',
        data:formdata,
        // headers: formdata.getHeaders(),
        headers:{
            token:req.session.token,
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
//修改用户状态
router.post('/api/remystatus',(req, res) => {
    let formdata = new FormData()
    formdata.append('status',req.body.status)
    formdata.append('id',req.session.userid)
    axios({
        method: 'POST',
        url: '/admin/updateUserPicture',
        data:formdata,
        // headers: formdata.getHeaders(),
        headers:{
            token:req.session.token,
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
//取消关注
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

function savefan(id,response,req){
    return new Promise((resolve,reject)=>{
        axios({
            url:'/admin/checkFocus',
            method:'get',  
            headers:{
                token:req.session.token,
            },
            params:{
                focus_id:req.session.userid,
                u_id:id,
            },    
        }).then(result=>{ 
            if(result.data.msg=="OK"){
                response.havefollow=result.data.data;
                resolve();
            }else{
                reject({ err: -1, msg: '获取失败' })
            }
        }).catch(function (error) {
            
        });
    })
}
function lookfollow(response,req){
    // console.log(response);
    // console.log(response.list);
    return new Promise((resolve,reject)=>{
        let funarr=[]
        for(let i in response.list){
            funarr[i]=savefan(response.list[i].id,response.list[i],req);
        }
        Promise.all(funarr)
        .then((allend) => {
            resolve(response)
        })
        .catch((err) => {
            reject()
        })
    })
}
//观看粉丝
router.get('/api/lookmyfans', (req, res) => {   
    return new Promise((resolve,reject)=>{
        axios({
            method:'GET',
            url:'/admin/showFan',
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid,
                size:req.query.size,
                begin_index:req.query.page,
            }
        }) 
        .then(result=>{
            // console.log(result.data);
            if(result.data.msg=='OK'){
                resolve(result.data)
            }else{
                reject({ err: -1, msg:result.data.msg})
            }
        }).catch(function (error) {
            reject({ err: -1, msg:error})
        });
    })
    .then(result2=>{
        return lookfollow(result2.data,req)
    })
    .then(result3=>{
        res.send({ err: 0, msg:result3})
    })
    .catch(err=>{
        console.log(err);
        res.send({ err: -1, msg: '获取失败' })
    })
})
//观看我的关注
router.get('/api/lookmyfollowers', (req, res) => {   
    return new Promise((resolve,reject)=>{
        axios({
            method:'GET',
            url:'/admin/showFocus',
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid,
                size:req.query.size,
                begin_index:req.query.page,
            }
        }) 
        .then(result=>{
            // console.log(result.data);
            if(result.data.msg=='OK'){
                resolve(result.data)
            }else{
                reject({ err: -1, msg:result.data.msg})
            }
        }).catch(function (error) {
            reject({ err: -1, msg:error})
        });
    })
    .then(result2=>{
        return lookfollow(result2.data,req)
    })
    .then(result3=>{
        res.send({ err: 0, msg:result3})
    })
    .catch(err=>{
        console.log(err);
        res.send({ err: -1, msg: '获取失败' })
    })
})
//修改个人邮箱
router.post('/api/remyemail', multipartMiddleware,(req, res) => {
    let formdata = new FormData()
    formdata.append('mail',req.body.email)
    formdata.append('id',req.session.userid)
    axios({
        method: 'POST',
        url: '/admin/updateUserPicture',
        data:formdata,
        headers:{
            token:req.session.token,
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
//检查是否有没读的消息
router.get('/api/getUserIsMessage', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/getUserIsMessage',
            method:'get',  
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid
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
    }else{
        res.send({ err: -1, msg:'未登录'})
    }
})
//检查是否有没读的聊天
router.get('/api/getUserIsChat', (req, res) => {   
    if(req.session.userid){
        axios({
            url:'/admin/getUnreadMessages',
            method:'get',  
            headers:{
                token:req.session.token,
            },
            params:{
                u_id:req.session.userid
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
    }else{
        res.send({ err: -1, msg:'未登录'})
    }
})
function oneaddtitle(onelist){
    return new Promise((resolve,reject)=>{
        axios({
            method:'GET',
            url:'/picture/showInfoMessage',
            params:{
                id:onelist.reflect_id,
            }
        }) 
        .then(result=>{
            if(result.data.msg=='OK'){
                onelist.title=result.data.data.images.describes
                resolve()
            }else{
                reject({ err: -1, msg:result.data.msg})
            }
        }).catch(function (error) {
            reject({ err: -1, msg:error})
        });
    })
}
function addAtitle(result){
    return new Promise((resolve,reject)=>{
        let funarr=[]
        for(let i in result.list){
            if(result.list[i].reflect_id!=null){
                funarr[i]=oneaddtitle(result.list[i])
            }
        }
        Promise.all(funarr)
        .then((allend) => {
            resolve(result)
        })
        .catch((err) => {
            reject()
        })
    })
}
//观看我的全部信息
router.get('/api/lookmymessage', (req, res) => {   
    return new Promise((resolve,reject)=>{
        axios({
            method:'GET',
            url:'/admin/getDynamic',
            headers:{
                token:req.session.token,
                // token:`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjUwMTQwNzcsImV4cCI6MTY2NTA3NDU1NywiaWQiOjUsInVzZXJuYW1lIjoiMjI5NTkwODI1MUBxcS5jb20iLCJwb3dlciI6IltzdHJuZywgL2FkbWluLyoqLCAvc29ja2V0LyoqLCBSb2xlX2FkbWluXSJ9.wUsrAoXYIdmereUzcqO4B8js8e-bdw1DHhO_D77VyDE`,
            },
            params:{
                // id:1,
                id:req.session.userid,
                size:req.query.size,
                begin_index:req.query.page,
            }
        }) 
        .then(result=>{
            if(result.data.msg=='OK'){
                resolve(result.data)
            }else{
                reject({ err: -1, msg:result.data.msg})
            }
        }).catch(function (error) {
            reject({ err: -1, msg:error})
        });
    })
    .then(result2=>{
        return addAtitle(result2.data)
    })
    .then(result3=>{
        res.send({ err: 0, msg:result3})
    })
    .catch(err=>{
        console.log(err);
        res.send({ err: -1, msg: '获取失败' })
    })
})
//根据类型观看我的全部信息
router.get('/api/lookmymessagebytype', (req, res) => {   
    return new Promise((resolve,reject)=>{
        axios({
            method:'GET',
            url:'/admin/getByTypeShowDynamic',
            headers:{
                token:req.session.token,
            },
            params:{
                // id:1,
                id:req.session.userid,
                type:req.query.type,
                size:req.query.size,
                begin_index:req.query.page,
            }
        }) 
        .then(result=>{
            if(result.data.msg=='OK'){
                resolve(result.data)
            }else{
                reject({ err: -1, msg:result.data.msg})
            }
        }).catch(function (error) {
            reject({ err: -1, msg:error})
        });
    })
    .then(result2=>{
        return addAtitle(result2.data)
    })
    .then(result3=>{
        res.send({ err: 0, msg:result3})
    })
    .catch(err=>{
        console.log(err);
        res.send({ err: -1, msg: '获取失败' })
    })
})
//删除信息
router.post('/api/deletemymessage', (req, res) => {
    axios({
        method: 'DELETE',
        url: '/admin/deleteDynamic',
        headers:{
            token:req.session.token,
        },
        params:{
            ids:req.body.toString()
        },
    }).then((result) => {
        if (result.data.msg == 'OK') {  
            res.send({ err: 0, msg: result.data })
        } else {
            res.send({ err: -1, msg: result.data })
        }
    }).catch((err) => {

        res.send({ err: -1, msg: err })
    })
})

//获取文章类型
router.get('/api/lookalltype', (req, res) => {   
    axios({
        url:'/picture/showAllType',
        method:'get',  
    }).then(response=>{ 
        if(response.data.msg=='OK'){
            res.send({ err: 0, msg:response.data.data});
        }else{
            res.send({ err: -1, msg:response.data.msg});
        }
    }).catch(function (error) {
        res.send({ err: -1, msg: '网络错误' })
    });
})
//观看两者的关注
router.get('/api/lookallchat', (req, res) => {   
    console.log();
        axios({
            method:'GET',
            url:'admin/getWebSocketInfo',
            headers:{
                token:req.session.token,
            },
            params:{
                from_id:req.query.fromid,
                send_id:req.query.toid,
                size:req.query.size,
                begin_index:req.query.page,
            }
        }) 
        .then(result=>{
            res.send({ err: 0, msg:result.data.data})
        })
        .catch(err=>{
            console.log(err);
            res.send({ err: -1, msg: '获取失败' })
        })
})
module.exports=router;

