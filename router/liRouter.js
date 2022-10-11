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

// 封装的查看多少点赞数量，以及是否点赞
function getLikeSumFn(url, type, obj) {
    return new Promise((resolve, resject) => {
        axios({
            method: type,
            url: url,
            params: obj
        })
            .then(result => {
                if (result.data.msg == 'OK') {
                    resolve(result.data)
                    return
                }
                resject(result.data)
            })
            .catch(err => {
                resject(err)
            })
    })
}
// 判断是否点赞
function judgeLike(req, sendResult) {
    return new Promise((resolve, resject) => {
        // 判断是否登录(没登录直接就是未点赞)
        if (!req.session.token) {
            sendResult.images.like = false
            resolve()
            return
        }
        axios({
            method: 'GET',
            url: '/admin/checkLike',
            params: {
                reflect_id: sendResult.images.id,
                u_id: req.session.user.id
            },
            headers: {
                token: req.session.token
            }
        })
            .then(result => {
                sendResult.images.like = result.data.data
                resolve()
            })
            .catch(err => {
                resject(err)
            })


    })
}
// 获取收藏数量
function getCollectNum(req, sendResult) {
    return new Promise((resolve, resject) => {
        axios({
            method: 'GET',
            url: '/picture/showCollectCount',
            params: {
                reflect_id: sendResult.images.id
            }
        })
            .then(result => {
                sendResult.images.collectNum = result.data.data
                resolve()
            })
            .catch(err => {
                resject(err)
            })
    })
}
// 获取是否收藏
function judgeCollect(req, sendResult) {
    return new Promise((resolve, resject) => {
        if (!req.session.token) {
            sendResult.images.collect = false
            resolve()
            return
        }
        axios({
            method: 'GET',
            url: '/admin/checkCollect',
            params: {
                img_id: sendResult.images.id,
                u_id: req.session.user.id
            },
            headers: {
                token: req.session.token
            }
        })
            .then(result => {
                // 判断是否收藏
                sendResult.images.collect = result.data.data
                resolve()
            })
            .catch(err => {
                resject(err)
            })
    })
}
// 获取作品点赞和收藏信息
function getWorkInfo(req, sendResult) {
    return new Promise((resolve, resject) => {
        // 发送点赞数目
        getLikeSumFn('/picture/getLike', 'GET', { reflect_id: sendResult.images.id })
            .then(result => {
                // 将点赞数目保存进去
                sendResult.images.likeNum = result.data
                // 获取当前用户是否点赞
                return judgeLike(req, sendResult)
            })
            .then(result => {
                return judgeCollect(req, sendResult)
            })
            .then(result => {
                return getCollectNum(req, sendResult)
            })
            .then(result => {
                resolve()
            })
            .catch(err => {
                resject(err)
            })
    })
}

// 获取是否关注对方
function judgeFocus(req, sendResult) {
    return new Promise((resolve, resject) => {
        if (!req.session.token) {
            sendResult.focusInfo = false
            resolve()
            return
        }
        axios({
            method: 'GET',
            url: '/admin/checkFocus',
            params: {
                focus_id: req.session.user.id,
                u_id: sendResult.id
            },
            headers: {
                token: req.session.token
            }
        })
            .then(result => {
                sendResult.focusInfo = result.data.data
                resolve()
            })
            .catch(err => {
                resject()
            })
    })
}

// 判断是否登录
router.post('/judgeLogin', (req, res) => {
    // 判断是否有值
    if (req.session.token) {
        res.send({ err: 0, msg: true, userInfo: req.session.user })
        return
    }
    res.send({ err: -1, msg: false })
})


// 发布评论
router.post('/admin/publicComment', mult, (req, res) => {
    let formdata = new FormData()
    for (let a in req.files) {
        formdata.append('file', fs.createReadStream(req.files[a].path), req.files[a].originalFilename)//第二个参数试上传的文件名
    }
    let { content, level, superId, reflectId, reportId } = req.body
    formdata.append('content', content)
    formdata.append('level', level)
    formdata.append('super_id', superId)
    formdata.append('reflect_id', reflectId)
    formdata.append('u_id', req.session.user.id)
    formdata.append('report_id', reportId)
    axios({
        method: 'POST',
        url: '/admin/publicComment',
        data: formdata,
        headers: {
            formdata: formdata.getHeaders(),
            maxBodyLength: 1000000000,
            token: req.session.token
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

// 获取所有评论
router.post('/picture/showComment', (req, res) => {
    let { id, beginIndex } = req.body
    axios({
        method: 'GET',
        url: '/picture/showComment',
        params: {
            reflect: id,
            begin_index: beginIndex,
            size: 1
        }
    })
        .then(result => {
            console.log('评论', result.data)
            if (result.data.msg == 'OK') {
                if (req.session.token) {
                    result.data.data.login = req.session.user.id
                }
                res.send({ err: 0, msg: result.data.data })
                return
            }
            req.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            console.log('错误', err)
            res.send({ err: -1, msg: err })
        })
})
// 删除评论
router.post('/admin/deleteComment', (req, res) => {
    let { id, userId } = req.body
    if (userId != req.session.user.id) {
        res.send({ err: -1, msg: '不能删除他人评论' })
        return
    }
    axios({
        method: 'DELETE',
        url: '/admin/deleteComment',
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
            req.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 收藏
router.post('/admin/addCollect', (req, res) => {
    let { imgId } = req.body
    axios({
        method: 'POST',
        url: '/admin/addCollect',
        params: {
            img_id: imgId,
            u_id: req.session.user.id
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
// 取消收藏
router.post('/admin/deleteCollect', (req, res) => {
    let { id } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteCollect',
        params: {
            img_id: id,
            u_id: req.session.user.id
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
    let { reflectId } = req.body
    axios({
        method: 'POST',
        url: '/admin/pointLike',
        params: {
            reflect_id: reflectId,
            u_id: req.session.user.id
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
// 取消点赞
router.post('/admin/deleteLike', (req, res) => {
    let { reflectId } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteLike',
        params: {
            reflect_id: reflectId,
            u_id: req.session.user.id
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
// 获取点赞数量
router.post('/picture/getLike', (req, res) => {
    let { reflectId } = req.body
    axios({
        method: 'GET',
        url: '/picture/getLike',
        params: {
            reflect_id: reflectId
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
    let { focusId, uId } = req.body
    axios({
        method: 'POST',
        url: '/admin/addFocus',
        params: {
            focus_id: focusId,
            u_id: uId
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
// 取消关注
router.post('/admin/deleteFocus', (req, res) => {
    let { focusId, uId } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteFocus',
        params: {
            focus_id: focusId,
            u_id: uId
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
// 通过id获取作品的一个详细信息
router.post('/picture/showInfoMessage', (req, res) => {
    let { id } = req.body
    axios({
        method: 'GET',
        url: '/picture/showInfoMessage',
        params: {
            id: id
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                getWorkInfo(req, result.data.data)
                    .then(() => {
                        res.send({ err: 0, msg: result.data.data })
                    })
                    .catch(err => {
                        res.send({ err: -1, msg: err })
                    })
                return
            }
            res.send({ err: -1, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})

// 首页热门信息
router.post('/picture/showAllPicture', (req, res) => {
    let { beginIndex } = req.body
    axios({
        method: 'GET',
        url: '/picture/showAllPicture',
        params: {
            begin_index: beginIndex,
            size: 1
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                let sendArr = []
                for (let i = 0; i < result.data.data.list.length; i++) {
                    sendArr[i] = getWorkInfo(req, result.data.data.list[i])
                }
                Promise.all(sendArr)
                    .then(() => {
                        res.send({ err: 0, msg: result.data.data })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 查看自己是否关注
router.post('/admin/checkFocus', (req, res) => {
    // 未登录
    if (!req.session.token) {
        res.send({ err: 0, msg: false })
        return
    }
    let { uId } = req.body
    axios({
        method: 'GET',
        url: '/admin/checkFocus',
        params: {
            focus_id: req.session.user.id,
            u_id: uId
        },
        headers: {
            token: req.session.token
        }
    })
        .then(result => {
            res.send({ err: 0, msg: result.data.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 关注
router.post('/li/admin/addFocus', (req, res) => {
    let { focusId } = req.body
    axios({
        method: 'POST',
        url: '/admin/addFocus',
        params: {
            focus_id: focusId,
            u_id: req.session.user.id
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
// 取消关注
router.post('/li/admin/deleteFocus', (req, res) => {
    let { focusId } = req.body
    axios({
        method: 'DELETE',
        url: '/admin/deleteFocus',
        params: {
            focus_id: focusId,
            u_id: req.session.user.id
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
// 获取关注动态
router.post('/admin/getFocusDynamic', (req, res) => {
    let { beginIndex } = req.body
    axios({
        method: 'GET',
        url: '/admin/getFocusDynamic',
        params: {
            begin_index: beginIndex,
            id: req.session.user.id,
            size: 10
        },
        headers: {
            token: req.session.token
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                let sendArr = []
                for (let i = 0; i < result.data.data.list.length; i++) {
                    sendArr[i] = getWorkInfo(req, result.data.data.list[i])
                }
                Promise.all(sendArr)
                    .then(() => {
                        res.send({ err: 0, msg: result.data.data })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 举报
router.post('/admin/addReport', (req, res) => {
    let { message, reportId, types } = req.body
    axios({
        method: 'POST',
        url: '/admin/addReport',
        params: {
            message: message,
            report_id: reportId,
            types: types,
            u_id: req.session.user.id
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
// 获取专辑信息
router.post('/picture/showAlbum', (req, res) => {
    let { id } = req.body
    axios({
        method: 'GET',
        url: '/picture/showAlbum',
        params: {
            id: id
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
// 获取轮播图片
router.post('/picture/showCarousel', (req, res) => {
    axios({
        method: 'GET',
        url: '/picture/showCarousel',
        params: {
            size: 3
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
// 通过专辑id获取信息
router.post('/picture/showAlbumById', (req, res) => {
    let { alId, beginIndex } = req.body
    axios({
        method: 'GET',
        url: '/picture/showAlbumById',
        params: {
            al_id: alId,
            begin_index: beginIndex,
            size: 10
        }
    })
        .then(result => {
            if (result.data.msg == 'OK') {
                let sendArr = []
                for (let i = 0; i < result.data.data.image.list.length; i++) {
                    sendArr[i] = getWorkInfo(req, result.data.data.image.list[i])
                }
                Promise.all(sendArr)
                    .then(() => {
                        res.send({ err: 0, msg: result.data.data })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        })
        .catch(err => {
            console.log(err)
            res.send({ err: -1, msg: err })
        })
})
// 推荐关注
router.post('/picture/recommendFocus', (req, res) => {
    let { size } = req.body
    axios({
        method: 'GET',
        url: '/picture/recommendFocus',
        params: {
            size: size
        }
    })
        .then(result => {
            let sendArr = []
            for (let i = 0; i < result.data.data.length; i++) {
                if (result.data.data[i]) {
                    sendArr[i] = judgeFocus(req, result.data.data[i])
                }
            }
            Promise.all(sendArr)
                .then(() => {
                    res.send({ err: 0, msg: result.data.data })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 搜索图片
router.post('/picture/getInfo/picture', (req, res) => {
    let { beginIndex, message, type } = req.body
    axios({
        method: 'GET',
        url: '/picture/getInfo',
        params: {
            begin_index: beginIndex,
            message: message,
            size: 10,
            type: type
        }
    })
        .then(result => {
            if (!result.data.data.info) {
                res.send({ err: 0, msg: result.data.data })
                return
            }
            let sendArr = []
            for (let i = 0; i < result.data.data.info.length; i++) {
                sendArr[i] = getWorkInfo(req, result.data.data.info[i])
            }
            Promise.all(sendArr)
                .then(() => {
                    res.send({ err: 0, msg: result.data.data })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
            res.send({ err: -1, msg: err })
        })
})
// 搜索专辑
router.post('/picture/getInfo/album', (req, res) => {
    let { beginIndex, message, type } = req.body
    axios({
        method: 'GET',
        url: '/picture/getInfo',
        params: {
            begin_index: beginIndex,
            message: message,
            size: 10,
            type: type
        }
    })
        .then(result => {
            res.send({ err: 0, msg: result.data })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 搜索达人
router.post('/picture/getInfo/talentShow', (req, res) => {
    let { beginIndex, message, type } = req.body
    axios({
        method: 'GET',
        url: '/picture/getInfo',
        params: {
            begin_index: beginIndex,
            message: message,
            size: 10,
            type: type
        }
    })
        .then(result => {
            let sendArr = []
            for (let i = 0; i < result.data.data.list.length; i++) {
                sendArr[i] = judgeFocus(req, result.data.data.list[i])
            }
            Promise.all(sendArr)
                .then(() => {
                    res.send({ err: 0, msg: result.data.data })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
// 显示分类
router.post('/picture/showAllType', (req, res) => {
    let { id } = req.body
    axios({
        method: 'GET',
        url: '/picture/showAllType',
    })
        .then(result => {
            for (let i = 0; i < result.data.data.length; i++) {
                if (result.data.data[i].type.id == id) {
                    res.send({ err: 0, msg: result.data.data[i] })
                    return
                }
            }
            res.send({ err: -1, msg: '没有该一级类别' })
        })
        .catch(err => {
            res.send({ err: -1, msg: err })
        })
})
module.exports = router
