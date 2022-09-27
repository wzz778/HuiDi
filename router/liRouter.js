const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
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
// 404页面
router.get('/404', (req, res) => {
    res.render('404.html')
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
module.exports = router
