const express = require('express');
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.all('*', (req, res, next) => {
    console.log('管理员的', jwt.decode(req.session.token))
    // if(!req.session.token){
    //     res.render('login.html')
    //     return
    // }
    // if(jwt.decode(req.session.token).power.indexOf('/superAdmin/')==-1){
    //     res.render('404.html')
    //     return
    // }   
    return next()
})

router.get('/homepage', (req, res) => {
    res.render('homepage.html');
})

router.get('/mangereport', (req, res) => {
    res.render('mangereport.html');
})

router.get('/detail', (req, res) => {
    res.render('detail.html');
})

router.get('/audit', (req, res) => {
    res.render('audit.html');
})
router.get('/classify', (req, res) => {
    res.render('classify.html');
})

router.get('/collection', (req, res) => {
    res.render('collection.html');
})
router.get('/role', (req, res) => {
    res.render('role.html');
})

axios.defaults.baseURL = 'http://152.136.99.236:8080/'


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
router.post('/superAdmin/manageRole', (req, res) => {
    let { list, role } = req.body;
    console.log('数组', list)
    let urlStr = ``
    let tempStr = `http://152.136.99.236:8080/superAdmin/manageRole?`
    for (let i = 0; i < list.length; i++) {
        urlStr += `list=${list[i]}&`
    }
    tempStr += urlStr
    tempStr += `role=${role}`
    console.log('url', tempStr)
    axios({
        method: 'POST',
        url: tempStr,
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
                temp.push(result.data.data.list[i].list[j].permiss_name)
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
    let { id } = req.query;
    axios({
        method: 'PUT',
        url: '/superAdmin/updateUserStatus',
        params: {
            id
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
    let {begin_index,size} = req.query
    axios({
        method: 'GET',
        url: '/superAdmin/showAlbum',
        params:{
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

module.exports = router;