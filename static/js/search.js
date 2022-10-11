// 修改a标签
let searchJumpInfo = document.getElementsByClassName('searchJumpInfo')
// 存放内容
let content = document.getElementById('content')
// 没有内容
let noContent = document.getElementById('noContent')
// 动画
let animation = document.getElementById('animation')
// 搜索没有内容
let searchNoContent = document.getElementById('searchNoContent')
// 搜索内容
let searchContent = document.getElementById('searchContent')

let pictureNowPage = 1
let pictureAllPages = 0
let albumNowPage = 1
let albumAllPages = 0
let talentShowNowPage = 1
let talentShowAllPages = 0
function getSearchInfo() {
    searchinput.value = decodeURI(window.location.search).split("=")[1].split('&')[0]
    // 将搜索类别报存到本地
    window.sessionStorage.setItem('searchType', decodeURI(window.location.search).split("=")[2])
    // 将搜索的链接替换
    for (let i = 0; i < searchJumpInfo.length; i++) {
        searchJumpInfo[i].href = `search?message=${decodeURI(window.location.search).split("=")[1].split('&')[0]}&type=${searchJumpInfo[i].innerHTML}`
        searchJumpInfo[i].classList.remove('clickSty')
        if (searchJumpInfo[i].innerHTML == window.sessionStorage.getItem('searchType')) {
            searchJumpInfo[i].classList.add('clickSty')
        }
    }
    if (decodeURI(window.location.search).split("=")[2] == '图片') {
        content.classList.remove('albumSty')
        content.classList.remove('talentShow')
        sendFn('/picture/getInfo/picture', {
            beginIndex: pictureNowPage,
            message: decodeURI(window.location.search).split("=")[1].split('&')[0],
            type: decodeURI(window.location.search).split("=")[2]
        }).then(result => {
            console.log(result)
            pictureAllPages = result.msg.page.all_page
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
                let imgStr = ``
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
        return
    }
    if (decodeURI(window.location.search).split("=")[2] == '专辑') {
        content.classList.add('albumSty')
        content.classList.remove('talentShow')
        sendFn('/picture/getInfo/album', {
            beginIndex: albumNowPage,
            message: decodeURI(window.location.search).split("=")[1].split('&')[0],
            type: decodeURI(window.location.search).split("=")[2]
        })
            .then(result => {
                console.log(result)
                albumAllPages = result.msg.data.all_page
                if (result.msg.data.list.length == 0) {
                    content.classList.add('none')
                    noContent.classList.remove('none')
                    animation.classList.add('none')
                    return
                }
                let tempStr = ``
                for (let i = 0; i < result.msg.data.list.length; i++) {
                    tempStr += `
            <div class="albumInfo">
                <a href="/album?id=${result.msg.data.list[i].id}">
                    <img src="/public/img/01.jpg" alt="">
                    <p>${result.msg.data.list[i].a_name}</p>
                    <span class="albumDescribe">${result.msg.data.list[i].describes}</span>
                </a>
            </div>
                    `
                }
                content.innerHTML = tempStr
            })
            .catch(err => {
                console.log(err)
            })
        return
    }
    if (decodeURI(window.location.search).split("=")[2] == '达人') {
        content.classList.remove('albumSty')
        content.classList.add('talentShow')
        sendFn('/picture/getInfo/talentShow', {
            beginIndex: talentShowNowPage,
            message: decodeURI(window.location.search).split("=")[1].split('&')[0],
            type: decodeURI(window.location.search).split("=")[2]
        })
            .then(result => {
                console.log(result)
                talentShowAllPages = result.msg.all_page
                if (result.msg.list.length == 0) {
                    content.classList.add('none')
                    noContent.classList.remove('none')
                    animation.classList.add('none')
                    return
                }
                let tempStr = ``
                for (let i = 0; i < result.msg.list.length; i++) {
                    let focusOnStr = ``
                    if (result.msg.list[i].focusInfo) {
                        focusOnStr = `
                        <button class="defaultSty focusSty" onclick="focusOnFn(this)">已关注</button>
                        `
                    } else {
                        focusOnStr = `
                        <button class="defaultSty" onclick="focusOnFn(this)">关注</button>
                        `
                    }
                    tempStr += `
            <div class="item clearFloat">
                <div class="itemImg floatLeft">
                    <a href="/userhomepage?id=${result.msg.list[i].id}">
                    <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].img_url}" onload="operatorImgFn(this)">
                    </a>
                </div>
                <div class="itemUserInfo floatLeft">
                    <!-- 用户名 -->
                    <a href="/userhomepage?id=${result.msg.list[i].id}">
                        ${result.msg.list[i].name}
                    </a>
                    <!-- 用户介绍 -->
                    <div class="userIntroduce">
                        <p>${result.msg.list[i].describes}</p>
                    </div>
                </div>
                <div class="floatRight operatorTalentShow">
                    <!-- 关注情况 -->
                    ${focusOnStr}
                    <div class="none">${result.msg.list[i].id}</div>
                </div>
            </div>
                    `
                }
                content.innerHTML = tempStr
            })
            .catch(err => {
                console.log(err)
            })
        return
    }
}
getSearchInfo()
// 收藏函数
function collectFn(event) {
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            // 判断是收藏还是取消收藏
            if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.value.indexOf('clickSty') != -1) {
                // 取消收藏
                sendFn('/admin/deleteCollect', { id: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.remove('clickSty')
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML--
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/addCollect', { imgId: event.parentElement.lastElementChild.innerHTML, uId: result.userInfo.id })
                .then(result => {
                    event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.classList.add('clickSty')
                    event.parentElement.parentElement.nextElementSibling.nextElementSibling.lastElementChild.lastElementChild.innerHTML++
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
            // 判断是点赞还是取消点赞
            if (event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.value.indexOf('clickSty') != -1) {
                // 取消收藏
                sendFn('/admin/deleteLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.remove('clickSty')
                        event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.innerHTML--
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/pointLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.classList.add('clickSty')
                    event.parentElement.parentElement.nextElementSibling.nextElementSibling.firstElementChild.lastElementChild.innerHTML++
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}
// 关注与取关函数
function focusOnFn(event) {
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            // 判断是关注函数取关
            if (event.classList.value.indexOf('focusSty') == -1) {
                sendFn('/admin/addFocus', { focusId: event.parentElement.lastElementChild.innerHTML, uId: result.userInfo.id })
                    .then(result => {
                        // 关注
                        event.innerHTML = '已关注'
                        event.classList.add('focusSty')
                    })
                    .catch(err => {
                        console.log(err)
                        hintFn('warning', '网络错误，请重试')
                    })
                return
            }
            // 取消关注
            sendFn('/admin/deleteFocus', { focusId: event.parentElement.lastElementChild.innerHTML, uId: result.userInfo.id })
                .then(result => {
                    event.innerHTML = '关注'
                    event.classList.remove('focusSty')
                })
                .catch(err => {
                    hintFn('warning', '网络错误，请重试')
                })
        })
        .catch((err) => {
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
    if (decodeURI(window.location.search).split("=")[2] == '图片') {
        // 请求关注动态
        let ynpicture = true
        // 没有数据了
        if (pictureNowPage >= pictureAllPages) {
            ynpicture = false
            animation.classList.add('none')
        }
        // 提示没有内容了
        if (event.wheelDelta < 0 && !ynpicture && pictureNowPage >= pictureAllPages) {
            // 判断是否该提示没有数据了
            if (scrollHeightOther <= scrollTop + windowHeight) {
                hintFn('warning', '没有更多内容了')
            }
        }
        if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && ynpicture) {
            pictureNowPage++
            getSearchInfo()
        }
        return
    }
    if (decodeURI(window.location.search).split("=")[2] == '专辑') {
        // 请求关注动态
        let ynalbum = true
        // 没有数据了
        if (albumNowPage >= albumAllPages) {
            ynalbum = false
            animation.classList.add('none')
        }
        // 提示没有内容了
        if (event.wheelDelta < 0 && !ynalbum && albumNowPage >= albumAllPages) {
            // 判断是否该提示没有数据了
            if (scrollHeightOther <= scrollTop + windowHeight) {
                hintFn('warning', '没有更多内容了')
            }
        }
        if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && ynalbum) {
            albumNowPage++
            getSearchInfo()
        }
        return
    }
    if (decodeURI(window.location.search).split("=")[2] == '达人') {
        // 请求关注动态
        let yntalentShow = true
        // 没有数据了
        if (talentShowNowPage >= talentShowAllPages) {
            yntalentShow = false
            animation.classList.add('none')
        }
        // 提示没有内容了
        if (event.wheelDelta < 0 && !yntalentShow && talentShowNowPage >= talentShowAllPages) {
            // 判断是否该提示没有数据了
            if (scrollHeightOther <= scrollTop + windowHeight) {
                hintFn('warning', '没有更多内容了')
            }
        }
        if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && yntalentShow) {
            talentShowNowPage++
            getSearchInfo()
        }
        return
    }
}

// 历史记录
function getSearchHistory() {
    console.log(window.localStorage.getItem('hdsearch_history'))
    if (!window.localStorage.getItem('hdsearch_history')) {
        searchNoContent.classList.remove('none')
        searchContent.classList.add('none')
        return
    }
    let historyInfo = JSON.parse(window.localStorage.getItem('hdsearch_history'))

    let tempStr = ``
    for (let i = 0; i < historyInfo.length; i++) {
        tempStr += `
    <span>
        <a href="/search?message=${historyInfo[i].message}&type=${historyInfo[i].type}">${historyInfo[i].message}</a>
        <button class="none" onclick="delSearchFn(this)" delIndex="${i}">
            <i class="iconfont">&#xe643;</i>
        </button>
    </span>
        `
    }
    searchContent.innerHTML = tempStr
}
getSearchHistory()
function delSearchFn(event) {
    // 将内容删除
    let historyInfo = JSON.parse(window.localStorage.getItem('hdsearch_history'))
    let searchArr = []
    for (let i = 0; i < historyInfo.length; i++) {
        if (i != event.getAttribute('delIndex')) {
            searchArr.push(historyInfo[i])
        }
    }
    event.parentElement.remove()
    window.localStorage.setItem('hdsearch_history', searchArr)
    if (!window.localStorage.getItem('hdsearch_history')) {
        searchNoContent.classList.remove('none')
        searchContent.classList.add('none')
    }
}
// 删除全部
function delAllSearch() {
    window.localStorage.setItem('hdsearch_history', '')
    getSearchHistory()
}