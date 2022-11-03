// 一级类别名字
let titleClassify = document.getElementById('titleClassify')
let title = document.getElementById('title')
// 存放内容
let allClassification = document.getElementById('allClassification')
// 没有类别内容
let noClassifyContent = document.getElementById('noClassifyContent')
// 没有内容
let noContent = document.getElementById('noContent')
// 当前显示的二级搜索内容
let searchInfo = document.getElementById('searchInfo')
// 内容区
let content = document.getElementById('content')
// 动画
let animation = document.getElementById('animation')
let searchMessge = ''
let nowPage = 1
let allPage = 0
let all = 0
sendFn('/picture/showAllType', { id: window.location.search.split("=")[1] })
    .then(result => {
        titleClassify.innerHTML = result.msg.type.name
        title.innerHTML = result.msg.type.name
        if (result.msg.list == 0) {
            noClassifyContent.classList.remove('none')
            searchInfo.classList.add('none')
            searchInfo.previousElementSibling.classList.add('none')
        }
        let tempStr = ''
        for (let i = 0; i < result.msg.list.length; i++) {
            tempStr += `
            <span onclick="choiceClassifyFn(this)">${result.msg.list[i].name}</span>
            `
        }
        searchMessge = result.msg.list[0] ? result.msg.list[0].name : result.msg.type.name
        if (searchInfo.classList.value.indexOf('none') == -1) {
            // 有二级分类
            searchInfo.innerHTML = searchMessge
        }
        allClassification.innerHTML = tempStr
        getSearchInfo()
    })
    .catch(err => {
        console.log(err)
    })

// 获取信息
function getSearchInfo() {
    sendFn('/picture/getInfo/picture', {
        beginIndex: nowPage,
        message: searchMessge,
        type: '图片'
    })
        .then(result => {
            all = result.msg.page.all_count
            content.classList.remove('none')
            noContent.classList.add('none')
            animation.classList.remove('none')
            if (all < 5) {
                animation.classList.add('none')
            }
            allPage = result.msg.page.all_page
            if (result.msg.info.length == 0) {
                content.classList.add('none')
                noContent.classList.remove('none')
                animation.classList.add('none')
                return
            }
            let tempStr = ``
            for (let i = 0; i < result.msg.info.length; i++) {
                // 判断是图片还是专辑还是达人
                let likeInfo = ``
                let collectInfo = ``
                let imgStr = ''
                for (let j = 0; j < result.msg.info[i].list.length; j++) {
                    imgStr += `<img src="${defaultImgUrl}" alt="" data-url="${result.msg.info[i].list[j]}" onload="operatorImgFn(this)">`
                }
                if (result.msg.info[i].images.like) {
                    likeInfo = `
                    <span class="clickSty">
                        <i class="iconfont">&#xec7f;</i>
                    <span>${result.msg.info[i].images.likeNum}</span>
                </span>
                    `
                } else {
                    likeInfo = `
                    <span>
                        <i class="iconfont">&#xec7f;</i>
                    <span>${result.msg.info[i].images.likeNum}</span>
                </span>
                    `
                }
                if (result.msg.info[i].images.collect) {
                    collectInfo = `
                    <span class="clickSty">
                        <i class="iconfont">&#xebae;</i>
                    <span>${result.msg.info[i].images.collectNum}</span>
                </span>
                    `
                } else {
                    collectInfo = `
                    <span>
                        <i class="iconfont">&#xebae;</i>
                    <span>${result.msg.info[i].images.collectNum}</span>
                </span>
                    `
                }
                tempStr += `
                <div class="middleContentItem">
                    <div class="middleContentSty">
                        <a href="/dynamicDetails?id=${result.msg.info[i].images.id}">
                            ${imgStr}
                        </a>
                        <div class="operator">
                            <span onclick="collectFn(this)">收藏</span>
                            <span onclick="likeFn(this)">点赞</span>
                            <a href="/dynamicDetails?id=${result.msg.info[i].images.id}">
                                <span>评论</span>
                            </a>
                            <div class="none">${result.msg.info[i].images.id}</div>
                        </div>
                    </div>
            
            <p class="textInfo">${result.msg.info[i].images.describes}</p>
            <span class="likeInfo">
                ${likeInfo}
                ${collectInfo}
            </span>
            <!-- 作者信息 -->
            <div class="userInfo">
                <a href="/userhomepage?id=${result.msg.info[i].users.id}">
                    <img src="${defaultImgUrl}" alt="" data-url="${result.msg.info[i].users.img_url}" onload="operatorImgFn(this)">
                </a>
                <span>
                    <a href="/userhomepage?id=${result.msg.info[i].users.id}">${result.msg.info[i].users.name}</a>
                    <span>
                        发布到
                        <a href="/album?id=${result.msg.info[i].album.id}">${result.msg.info[i].album.a_name}</a>
                    </span>
                </span>
            </div>
        </div>
                `
            }
            content.innerHTML = tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
// 收藏函数
function collectFn(event) {
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            event.setAttribute('onclick', "hintFn('warning', '请勿连点')")
            // 判断是收藏还是取消收藏
            if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.value.indexOf('clickSty') != -1) {
                // 取消收藏
                sendFn('/admin/deleteCollect', { id: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        event.setAttribute('onclick', 'collectFn(this)')
                        if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML == 0) {
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.remove('clickSty')
                            return
                        }
                        if (result.msg == 'success') {
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.remove('clickSty')
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML--
                            return
                        }
                        hintFn('warning', '请勿连点')
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/addCollect', { imgId: event.parentElement.lastElementChild.innerHTML, uId: result.userInfo.id })
                .then(result => {
                    event.setAttribute('onclick', 'collectFn(this)')
                    if (result.msg == 'success') {
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.add('clickSty')
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML++
                        return
                    }
                    hintFn('warning', '请勿连点')
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}
// 点赞函数
function likeFn(event) {
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            event.setAttribute('onclick', "hintFn('warning','请勿连点')")
            // 判断是点赞还是取消点赞
            if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.value.indexOf('clickSty') != -1) {
                // 取消收藏
                sendFn('/admin/deleteLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        event.setAttribute('onclick', "likeFn(this)")
                        if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.innerHTML == 0) {
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.remove('clickSty')
                            return
                        }
                        if (result.msg == 'success') {
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.remove('clickSty')
                            event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.innerHTML--
                            return
                        }
                        hintFn('warning', '请勿连点')
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/pointLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    if (result.msg == 'success') {
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.add('clickSty')
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.innerHTML++
                        return
                    }
                    hintFn('warning', '请勿连点')
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}

window.onmousewheel = function (event) {
    // 视口的高度
    const viewHeight = document.documentElement.clientHeight
    // 滚动条高度
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
    const offsetHeight = animation.offsetTop
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动条距离顶部的距离
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 可视区的高度
    let scrollHeightOther = document.documentElement.scrollHeight || document.body.scrollHeight //dom元素的高度，包含溢出不可见的内容
    // 请求关注动态
    let ynpicture = true
    // 没有数据了
    if (nowPage >= allPage) {
        ynpicture = false
        animation.classList.add('none')
    }
    // 提示没有内容了
    if (event.wheelDelta < 0 && !ynpicture && nowPage >= allPage) {
        // 判断是否该提示没有数据了
        if (scrollHeightOther <= scrollTop + windowHeight) {
            if (content.getElementsByClassName('middleContentItem').length == all) {
                noContent.classList.remove('none')
            }
        }
    }
    if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && ynpicture) {
        nowPage++
        getSearchInfo()
    }
}

function choiceClassifyFn(event) {
    if (searchInfo.innerHTML == event.innerHTML) {
        return
    }
    searchMessge = event.innerHTML
    searchInfo.innerHTML = event.innerHTML
    nowPage = 1
    getSearchInfo()
}