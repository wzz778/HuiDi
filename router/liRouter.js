const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const multipart = require('connect-multiparty')
const FormData = require('form-data')
var multiparty = require('multiparty')
const fs = require('fs')
var mult = multipart()
const axios = require('axios')

// 指定默认请求路径
axios.defaults.baseURL = 'http://152.136.99.236:8080/'

// 访问页面
// 首页
router.get('/', (req, res) => {
    res.render('index.html')
})
// 图片分类显示
router.get('/Classification', (req, res) => {
    res.render('Classification.html')
})
// 专辑图片
router.get('/album', (req, res) => {
    res.render('album.html')
})
// 动态详情页
router.get('/dynamicDetails', (req, res) => {
    res.render('dynamicDetails.html')
})
// 搜索详情页
router.get('/search', (req, res) => {
    res.render('search.html')
})
// 关注更多
router.get('/focusOnMore', (req, res) => {
    res.render('focusOnMore.html')
})
// 404页面
router.get('/404', (req, res) => {
    res.render('404.html')
})

// 判断是否登录
router.post('/judgeLogin', (req, res) => {
    // 判断是否有值
    if (req.session.token) {
        res.send({ err: 0, msg: true })
        return
    }
    res.send({ err: -1, msg: false })
})

// 动态详情页信息
router.post('/admin/showComment', (req, res) => {
    let { id } = req.body
    axios({
        method: 'GET',
        url: '/admin/showComment',
        params: {
            reflect: id
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
            }
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 发布评论
router.post('/admin/publicComment', mult, (req, res) => {
    let formdata = new FormData()
    for (let a in req.files) {
        formdata.append('file', fs.createReadStream(req.files[a].path), req.files[a].originalFilename)//第二个参数试上传的文件名
    }
    let { content, level, superId, reflectId } = req.body
    console.log('传的数据', req.body)
    formdata.append('content', content)
    formdata.append('level', level)
    formdata.append('super_id', superId)
    formdata.append('reflect_id', reflectId)
    axios({
        method: 'POST',
        url: '/admin/publicComment',
        data: formdata,
        headers: {
            // token: req.session.token,
            formdata: formdata.getHeaders(),
            maxBodyLength: 1000000000
        }
    })
        .then(result => {
            console.log(result.data)
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            req.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 获取所有评论
router.post('/admin/showComment', (req, res) => {
    let { id } = req.body
    axios({
        method: 'GET',
        url: '/admin/showComment',
        params: {
            reflect: id
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            req.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 收藏
router.post('/admin/addCollect', (req, res) => {
    let { imgId, uId } = req.body
    axios({
        method: 'POST',
        url: '/admin/addCollect',
        params: {
            img_id: imgId,
            u_id: uId
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            res.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 取消收藏
router.post('/admin/deleteCollect', (req, res) => {
    let { id } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteCollect',
        params: {
            id: id
        },
        headers: {
            token: req.session.token
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            res.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 点赞
router.post('/admin/pointLike', (req, res) => {
    let { uId, reflectId } = req.body
    axios({
        method: 'POST',
        url: '/admin/pointLike',
        params: {
            reflect_id: reflectId,
            u_id: uId
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            res.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 取消点赞
router.post('/admin/deleteLike', (req, res) => {
    let { reflectId, uId } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteLike',
        params: {
            reflect_id: reflectId,
            u_id: uId
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            res.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 关注
router.post('/admin/addFocus', (req, res) => {
    let { focusId, uId }=req.body
    axios({
        method:'POST',
        url:'/admin/addFocus',
        params:{
            focus_id:focusId,
            u_id:uId
        }
    })
})
module.exports = router
