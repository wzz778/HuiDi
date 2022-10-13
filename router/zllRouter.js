const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const e = require('express');
const router = express.Router();

// 设置全局的拦截
router.all('*', (req, res, next) => {
    console.log('管理员的', jwt.decode(req.session.token))
    if(!req.session.token){
        res.render('login.html')
        return
    }
    if(jwt.decode(req.session.token).power.indexOf('/superAdmin/')==-1){
        res.render('404.html')
        return
    }   
    return next()
})

// 用户管理页面
router.get('/homepage', (req, res) => {
    res.render('homepage.html');
})


// 举报管理页面
router.get('/mangereport', (req, res) => {
    res.render('mangereport.html');
})

// 详情页面
router.get('/detail', (req, res) => {
    res.render('detail.html');
})


// 内容管理页面
router.get('/audit', (req, res) => {
    res.render('audit.html');
})

// 分类管理页面
router.get('/classify', (req, res) => {
    res.render('classify.html');
})

// 专辑管理页面
router.get('/collection', (req, res) => {
    res.render('collection.html');
})


// 角色管理页面
router.get('/role', (req, res) => {
    res.render('role.html');
})
// 认证范围管理
router.get('/authentication', (req, res) => {
    res.render('authentication.html');
})

axios.defaults.baseURL = 'http://152.136.99.236:8080/'



// 获取管理员的信息
router.get('/superAdmin/gainId',(req,res) =>{
    let user = req.session.user;
    res.send({err:0,msg:user});
})

//显示所有用户
router.get('/superAdmin/showAllUser', (req, res) => {
    let { begin, size } = req.query;
    
    axios({
        method: 'GET',
        url: '/superAdmin/showAllUser',
        params: {
            begin: begin,
            size: size,
        },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//审核通过
router.get('/superAdmin/updateStatus', (req, res) => {
    let { id } = req.query;
    axios({
        method: 'PUT',
        url: '/superAdmin/updateStatus',
        params: {
            id
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//审核失败
router.get('/superAdmin/updatePass', (req, res) => {
    let { id ,message} = req.query;
    axios({
        method: 'PUT',
        url: '/superAdmin/updatePass',
        params: {
            id:id,
            message:message
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//删除角色信息
router.get('/superAdmin/deleteRole', (req, res) => {
    let { id } = req.query;
    axios({
        method: 'DELETE',
        url: '/superAdmin/deleteRole',
        params: {
            id:id
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//添加角色信息
router.get('/superAdmin/manageRole', (req, res) => {
    let { list, role_name , orders} = req.query;
    console.log('数组', list)
    let urlStr = ``
    let tempStr = `http://152.136.99.236:8080/superAdmin/manageRole?`
    for (let i = 0; i < list.length; i++) {
        urlStr += `list=${list[i]}&`
    }
    tempStr += urlStr
    tempStr += `role_name=${role_name}`
    tempStr += `orders=${orders}`
    // console.log('url', tempStr)
    // list = JSON.stringify(list);
    console.log(list);
    axios({
        method: 'POST',
        url: tempStr,
        // params:{
        //     list:list,
        //     role_name:role_name,
        //     orders:orders
        // },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//显示未审核的内容
router.get('/superAdmin/showAllNoPass', (req, res) => {
    let { begin_index,size } = req.query;
    axios({
        method: 'GET',
        url: '/superAdmin/showAllNoPass',
        params: {
            begin_index:begin_index,
            size:size
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//显示单个未审核的内容
router.get('/superAdmin/showAllNoPasss', (req, res) => {
    let { begin_index,size ,id} = req.query;
    axios({
        method: 'GET',
        url: '/superAdmin/showAllNoPass',
        params: {
            begin_index:begin_index,
            size:size,
            id:id
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})






//显示角色内容即可用接口
router.get('/superAdmin/showRole', (req, res) => {
    let {begin_index,size} = req.query
    axios({
        method: 'GET',
        url: '/superAdmin/showRole',
        params:{
            begin_index:begin_index,
            size:size
        },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        let temps = {

        }
        for (let i = 0; i < result.data.data.list.length; i++) {
            let temp = [];
            for (let j = 0; j < result.data.data.list[i].list.length; j++) {
                let arr = result.data.data.list[i].list[j].permiss_name.split('/');
                if( arr.length == 1){
                    temp.push(arr[0])
                }else{
                    temp.push(arr[1])
                }
                console.log(arr);
                // temp.push(result.data.data.list[i].list[j].permiss_name)
                temps[i] = temp
            }
        }
        res.send({ err: 0, msg: result.data.data, temps: temps })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//更改角色信息
router.get('/superAdmin/updateRole', (req, res) => {
    let {id,role_name} = req.query;
    console.log(id,role_name);
    axios({
        method: 'PUT',
        url: '/superAdmin/updateRole',
        params:{
            id:id,
            role_name:role_name,
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log('----------------', result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        console.log(err)
        res.send({ err: -1, msg: error })
    })
})



//修改角色权限所用的接口
router.get('/superAdmin/updateRolePermiss',(req,res)=>{
    let {id,permiss_name,r_id} = req.query;
    axios({
        method:'PUT',
        url:'/superAdmin/updateRolePermiss',
        params:{
            id:id,
            permiss_name:permiss_name,
            r_id:r_id
        },
        headers:{
            token:req.session.token,
        }
    }).then((result) => {
        console.log('----------------', result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        // console.log(err)
        res.send({ err: -1, msg: error })
    })
})



//修改用户状态
router.get('/superAdmin/updateUserStatus', (req, res) => {
    let { id ,end_time,status} = req.query;
    axios({
        method: 'PUT',
        url: '/superAdmin/updateUserStatus',
        params: {
            id:id,
            end_time:end_time,
            status:status
        },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//为已有角色添加权限信息
router.get('/superAdmin/addRolePermission', (req, res) => {
    let { id, permiss_name, r_id } = req.query;
    axios({
        method: 'POST',
        url: '/superAdmin/addRolePermission',
        params: {
            permiss_name,
            r_id
        },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})
//添加第一级分类
router.get('/superAdmin/addTypes', (req, res) => {
    let { level, name} = req.query;
    axios({
        method: 'POST',
        url: '/superAdmin/addTypes',
        params: {
            level:level,
            name:name,
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//添加第二级分类
router.get('/superAdmin/addTypess', (req, res) => {
    let { level, name,super_id} = req.query;
    axios({
        method: 'POST',
        url: '/superAdmin/addTypes',
        params: {
            level:level,
            name:name,
            super_id:super_id,
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//删除类型
router.get('/superAdmin/deleteType', (req, res) => {
    let { id } = req.query;
    axios({
        method: 'DELETE',
        url: '/superAdmin/deleteType',
        params: {
            id,
        },
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})
//显示专辑
router.get('/superAdmin/showAlbum', (req, res) => {
    let {begin_index,size,status} = req.query
    // status = JSON.stringify(status);
    axios({
        method: 'GET',
        url: '/superAdmin/showAlbum',
        params:{
            begin_index:begin_index,
            size:size,
            status:status
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})
//显示所有类型
router.get('/superAdmin/showAllType', (req, res) => {
    axios({
        method: 'GET',
        url: '/superAdmin/showAllType',
        headers: {
            token: req.session.token
        }
    }).then((result) => {
        console.log(result.data.data);
        console.log(result.data.data.length);
        let temps = {

        }
        for (let i = 0; i < result.data.data.length; i++) {
            let temp = [];
            if(result.data.data[i].list.length == 0){
                // console.log(1);
                temps[i] = temp
            }else{
                for (let j = 0; j < result.data.data[i].list.length; j++) {
                    temp.push(result.data.data[i].list[j])
                    temps[i] = temp
                }
            }
        }
        res.send({ err: 0, msg: result.data.data, temps: temps })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})
//根据角色名获取信息
router.get('/superAdmin/showByRoleName', (req, res) => {
    let { role_name } = req.query
    axios({
        method: 'GET',
        url: '/superAdmin/showByRoleName',
        params: {
            role_name
        },
        headers: {
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//修改分类
router.get('/superAdmin/updateType',(req,res)=>{
    let {id,name}  = req.query;
    axios({
        method:'PUT',
        url:'/superAdmin/updateType',
        params:{
            id:id,
            name:name
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//更新专辑状态
router.get('/superAdmin/updateAlbumStatus',(req,res)=>{
    let {id,status} = req.query;
    axios({
        method:'PUT',
        url:'/superAdmin/updateAlbumStatus',
        params:{
            id:id,
            status:status
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})
//更新专辑状态
router.get('/superAdmin/updateAlbumStatuss',(req,res)=>{
    let {id,status,message} = req.query;
    axios({
        method:'PUT',
        url:'/superAdmin/updateAlbumStatus',
        params:{
            id:id,
            status:status,
            message:message
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

// 受理举报
router.get('/superAdmin/acceptReport',(req,res)=>{
    let {begin_index,size,type} = req.query
    axios({
        method:'GET',
        url:'/superAdmin/acceptReport',
        params:{
            begin_index:begin_index,
            size:size,
            type:type
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

// 随机显示专辑
router.get('/superAdmin/showRandomAlbum',(req,res)=>{
    axios({
        method:'GET',
        url:'/superAdmin/showRandomAlbum',
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


// 增添认证信息的内容
router.get('/superAdmin/addCertificationInfo',(req,res)=>{
    let {area_name} = req.query;
    axios({
        method:'POST',
        url:'/superAdmin/addCertificationInfo',
        params:{
            area_name:area_name
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//删除认证领域具体内容
router.get('/superAdmin/deleteCertificationArea',(req,res)=>{
    let {ids} = req.query;
    axios({
        method:'DELETE',
        url:'/superAdmin/deleteCertificationArea',
        params:{
            ids:ids
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

//修改认证领域的内容
router.get('/superAdmin/updateCertificationArea',(req,res)=>{
    let {area_name , id} = req.query;
    axios({
        method:'PUT',
        url:'/superAdmin/updateCertificationArea',
        params:{
            area_name:area_name,
            id:id
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//认证用户信息
router.get('/superAdmin/certificationUser',(req,res)=>{
    let {certification , id} = req.query;
    axios({
        method:'POST',
        url:'/superAdmin/certificationUser',
        params:{
            certification:certification,
            id:id
        },
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})


//显示能给用户认证领域的具体内容
router.get('/superAdmin/showCertificationArea',(req,res)=>{
    axios({
        method:'GET',
        url:'/superAdmin/showCertificationArea',
        headers:{
            token:req.session.token
        }
    }).then((result) => {
        console.log(result.data);
        res.send({ err: 0, msg: result.data.data })
    }).catch((error) => {
        res.send({ err: -1, msg: error })
    })
})

module.exports = router;