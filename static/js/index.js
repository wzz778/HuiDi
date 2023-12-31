// 轮播图
let carousel = document.getElementsByClassName('carousel')
let carouselPoints = document.getElementsByClassName('carouselPoints')[0].getElementsByTagName('span')
// 存放热门信息的盒子
let hotTicket = document.getElementById('hotTicket')
// 关注动态
let focusOn = document.getElementById('focusOn')
// 举报的弹窗
let reportHint = document.getElementsByClassName('reportHint')
// 举报选择原因
let reportReason = document.getElementById('reportReason')
// 其他原因
let otherReason = document.getElementById('otherReason')
// 存放举报作品的id
let reportId = document.getElementById('reportId')
// 定义一个变量用于看是第几个图片
let carouselIndex = 0
// 开始定时器
let timerIndex = ''
// 动画
let animation = document.getElementById('animation')
// 
let carouselInfo = document.getElementById('carouselInfo')
// 绑定事件
let bindEvent = document.getElementById('bindEvent')
// 推荐关注
let focusOnContent = document.getElementById('focusOnContent')
// 存放热门内容
let carouselRightAll = document.getElementById('carouselRightAll')
// 精选
let carouselOne = document.getElementById('carouselOne')
// 没有内容了
let noContent = document.getElementById('noContent')
let temTwo = null
// 定时器
carousel[0].style.left = -760 + "px"
function beginSettimeout() {
    timerIndex = setInterval(() => {
        carouselIndex++
        carouselIndex = carouselIndex % 3
        move(-carouselIndex * 760, -1)
    }, 3000)
}
function move(num, operation, tempNum) {
    // carousel[0].style.left = (-carouselIndex * 760) + "px"
    let tempI = 1
    clearInterval(temTwo)
    temTwo = setInterval(() => {
        carousel[0].style.left = num + operation * (tempI * 30) + tempNum + "px"
        tempI++
        if (tempI == 26) {
            tempI = 1
            clearInterval(temTwo)
        }
    }, 30)
    // 将所有点的样式清除
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}
beginSettimeout()

// 点击跳转到指定图片
function clickJump(num) {
    carouselIndex = num
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = -(carouselIndex + 1) * 760 + 'px'
    clearInterval(timerIndex)
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}

function endSettimeout() {
    clearInterval(timerIndex)
}

bindEvent.setAttribute('onmouseleave', 'beginSettimeout()')
bindEvent.setAttribute('onmouseenter', 'endSettimeout()')

// 点击左箭头
function leftArrow() {
    clearInterval(timerIndex)
    if (carouselIndex == 0) {
        carouselIndex = 3
    }
    carouselIndex--
    carouselIndex = carouselIndex % 3
    move(-(carouselIndex + 2) * 760, 1, 10)
}
// 点击右箭头
function rightArrow() {
    clearInterval(timerIndex)
    carouselIndex++
    carouselIndex = carouselIndex % 3
    move(-carouselIndex * 760, - 1, -10)
}

// 首页左边导航栏
let centerMiddle = document.getElementsByClassName('centerMiddle')
let navOperatorChoice = document.getElementsByClassName('navOperatorChoice')
function navFn(show, close) {
    noContent.classList.add('none')
    animation.classList.remove('none')
    centerMiddle[close].classList.add('none')
    centerMiddle[show].classList.remove('none')
    // 为其添加样式
    navOperatorChoice[show].classList.add('navChoiceSty')
    navOperatorChoice[show].firstElementChild.classList.add('navTextChoiceSty')
    // 移除样式
    navOperatorChoice[close].classList.remove('navChoiceSty')
    navOperatorChoice[close].firstElementChild.classList.remove('navTextChoiceSty')
    // 登录了且关注动态里边没有内容时去请求
    if (show == 1 && focusOn.getElementsByTagName('div').length == 0) {
        getFocusOn()
    }
}
let nowPageHotTicket = 1
let allPageHotTicket = 0
let nowPageFocusOn = 1
let allPageHotFocusOn = 0
let all = 0
// 获取热门内容
function getHotTicket() {
    sendFn('/picture/showAllPicture', { beginIndex: nowPageHotTicket })
        .then(result => {
            all = result.msg.all_count
            if (all < 5) {
                animation.classList.add('none')
            }
            allPageHotTicket = result.msg.all_page
            let tempStr = ''
            for (let i = 0; i < result.msg.list.length; i++) {
                let tempImg = ''
                for (let j = 0; j < result.msg.list[i].list.length; j++) {
                    tempImg += `
                    <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].list[j]}" onload="operatorImgFn(this)">
                    `
                }
                let tepmLike = ''
                if (result.msg.list[i].images.like) {
                    // 点赞了
                    tepmLike = `
                    <span class="likeSty" onclick="likeFn(this)">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.list[i].images.likeNum}</span>
                    </span>
                    `
                } else {
                    tepmLike = `
                    <span onclick="likeFn(this)">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.list[i].images.likeNum}</span>
                    </span>
                    `
                }
                let tempCollect = ''
                if (result.msg.list[i].images.collect) {
                    tempCollect = `
                    <span class="likeSty" onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.list[i].images.collectNum}</span>
                    </span>
                    `
                } else {
                    tempCollect = `
                    <span onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.list[i].images.collectNum}</span>
                    </span>
                    `
                }

                tempStr += `
                <div class="centerMiddleItem">
                    <div class="centerMiddleItemUser">
                        <div class="userInfo">
                            <a href="/userhomepage?id=${result.msg.list[i].users.id}">
                                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].users.img_url}" onload="operatorImgFn(this)">
                            </a>
                            <div class="userName">
                                <!-- 用户名 -->
                                <a href="/userhomepage?id=${result.msg.list[i].users.id}">
                                    <span>${result.msg.list[i].users.name}</span>
                                </a>
                                <span>热门内容</span>
                            </div>
                        </div>
                        <div class="userPostContent">
                            <p>${result.msg.list[i].images.describes}</p>
                            <a href="/dynamicDetails?id=${result.msg.list[i].images.id}">
                                <div class="userPostContentAllimg">
                                    ${tempImg}
                                </div>
                            </a>
                            <div class="userWorkOperate">
                                ${tepmLike}
                                ${tempCollect}
                                <span onclick="reportFn(this)">
                                    <i class="iconfont">&#xe601;</i>
                                    <span>举报</span>
                                </span>
                                <div class="none">${result.msg.list[i].images.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }
            hotTicket.innerHTML += tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
getHotTicket()
// 获取关注动态
function getFocusOn() {
    judgeLogin()
        .then(result => {
            // 登录了去访问关注接口
            sendFn('/admin/getFocusDynamic', { beginIndex: nowPageFocusOn })
                .then(result => {
                    if (result.msg.list.length == 0) {
                        animation.classList.add('none')
                        noContent.classList.remove('none')
                        focusOn.classList.add('none')
                        return
                    }
                    all = result.msg.all_count
                    if (all < 5) {
                        animation.classList.add('none')
                    }
                    allPageHotFocusOn = result.msg.all_page
                    let tempStr = ''
                    for (let i = 0; i < result.msg.list.length; i++) {
                        let tempImg = ''
                        for (let j = 0; j < result.msg.list[i].list.length; j++) {
                            tempImg += `
                    <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].list[j]}" onload="operatorImgFn(this)">
                    `
                        }
                        let tepmLike = ''
                        if (result.msg.list[i].images.like) {
                            // 点赞了
                            tepmLike = `
                    <span class="likeSty" onclick="likeFn(this)">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.list[i].images.likeNum}</span>
                    </span>
                    `
                        } else {
                            tepmLike = `
                    <span onclick="likeFn(this)">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.list[i].images.likeNum}</span>
                    </span>
                    `
                        }
                        let tempCollect = ''
                        if (result.msg.list[i].images.collect) {
                            tempCollect = `
                    <span class="likeSty" onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.list[i].images.collectNum}</span>
                    </span>
                    `
                        } else {
                            tempCollect = `
                    <span onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.list[i].images.collectNum}</span>
                    </span>
                    `
                        }

                        tempStr += `
                <div class="centerMiddleItem">
                    <div class="centerMiddleItemUser">
                        <div class="userInfo">
                            <a href="/userhomepage?id=${result.msg.list[i].users.id}">
                                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].users.img_url}" onload="operatorImgFn(this)">
                            </a>
                            <div class="userName">
                                <!-- 用户名 -->
                                <a href="/userhomepage?id=${result.msg.list[i].users.id}">
                                    <span>${result.msg.list[i].users.name}</span>
                                </a>
                                <span>关注内容</span>
                            </div>
                        </div>
                        <div class="userPostContent">
                            <p>${result.msg.list[i].images.describes}</p>
                            <a href="/dynamicDetails?id=${result.msg.list[i].images.id}">
                                <div class="userPostContentAllimg">
                                    ${tempImg}
                                </div>
                            </a>
                            <div class="userWorkOperate">
                                ${tepmLike}
                                ${tempCollect}
                                <span onclick="reportFn(this)">
                                    <i class="iconfont">&#xe601;</i>
                                    <span>举报</span>
                                </span>
                                <div class="none">${result.msg.list[i].images.id}</div>
                            </div>
                        </div>
                    </div>
                </div>
                `
                    }
                    focusOn.innerHTML += tempStr
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            navFn(0, 1)
            // 未登录
            window.location.href = '/login'
        })
}
// 监听滚轮事件
window.onmousewheel = function (event) {
    // 视口的高度
    const viewHeight = document.documentElement.clientHeight
    // 滚动条高度
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
    const offsetHeight = animation.offsetTop
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动条距离顶部的距离
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 可视区的高度
    let scrollHeightOther = document.documentElement.scrollHeight || document.body.scrollHeight //dom元素的高度，包含溢出不可见的内容
    // 判断是热门事件还是关注动态
    if (centerMiddle[0].classList.value.indexOf('none') == -1) {
        // 看最后一个盒子是否显现
        let yn = true
        // 没有数据了
        if (nowPageHotTicket == allPageHotTicket) {
            yn = false
            animation.classList.add('none')
        }
        // 提示没有内容了
        if (event.wheelDelta < 0 && !yn && nowPageHotTicket == allPageHotTicket) {
            // 判断是否该提示没有数据了
            if (scrollHeightOther <= scrollTop + windowHeight) {
                // 判断是否加载完了
                if (hotTicket.getElementsByClassName('centerMiddleItem').length == all) {
                    noContent.classList.remove('none')
                }
            }
        }
        if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && yn) {
            nowPageHotTicket++
            getHotTicket()
        }
        return
    }
    // 请求关注动态
    let ynFocus = true
    // 没有数据了
    if (nowPageFocusOn >= allPageHotFocusOn) {
        ynFocus = false
        animation.classList.add('none')
    }
    // 提示没有内容了
    if (event.wheelDelta < 0 && !ynFocus && nowPageFocusOn == allPageHotFocusOn) {
        // 判断是否该提示没有数据了
        if (scrollHeightOther <= scrollTop + windowHeight) {
            if (focusOn.getElementsByClassName('centerMiddleItem').length == all) {
                noContent.classList.remove('none')
            }
        }
    }
    if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && ynFocus) {
        nowPageFocusOn++
        getFocusOn()
    }
}

// 点赞函数
function likeFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            // 判断是点赞还是取消点赞
            if (event.classList.value.indexOf('likeSty') == -1) {
                event.setAttribute('onclick', "hintFn('warning', '请勿连点')")
                // 点赞
                sendFn('/admin/pointLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 添加类名
                        event.setAttribute('onclick', "likeFn(this)")
                        if (result.msg == 'success') {
                            event.classList.add('likeSty')
                            event.lastElementChild.innerHTML++
                            return
                        }
                        hintFn('warning', '请勿连点,此行为可能造成封号')
                    })
                    .catch(err => {
                        event.setAttribute('onclick', "likeFn(this)")
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/deleteLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    if (event.lastElementChild.innerHTML == 0) {
                        event.classList.remove('likeSty')
                        return
                    }
                    if (result.msg == 'success') {
                        event.classList.remove('likeSty')
                        event.lastElementChild.innerHTML--
                        return
                    }
                    event.setAttribute('onclick', "likeFn(this)")
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(err => {
            event.setAttribute('onclick', "likeFn(this)")
            hintFn('warning', '请先登录')
        })
}
// 收藏函数
function collectFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            event.setAttribute('onclick', "hintFn('warning', '请勿连点')")
            if (event.classList.value.indexOf('likeSty') == -1) {
                // 收藏
                sendFn('/admin/addCollect', { imgId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 添加类名
                        event.setAttribute('onclick', "collectFn(this)")
                        if (result.msg == 'success') {
                            event.classList.add('likeSty')
                            event.lastElementChild.innerHTML++
                            return
                        }
                        hintFn('warning', '请勿连点,此行为可能造成封号')
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/deleteCollect', { id: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    event.setAttribute('onclick', "collectFn(this)")
                    if (event.lastElementChild.innerHTML == 0) {
                        event.classList.remove('likeSty')
                        return
                    }
                    if (result.msg == 'success') {
                        event.classList.remove('likeSty')
                        event.lastElementChild.innerHTML--
                        return
                    }
                    hintFn('warning', '请勿连点,此行为可能造成封号')
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}
// 举报弹窗显现
function reportFn(event) {
    judgeLogin()
        .then(result => {
            reportHint[0].classList.remove('none')
            reportId.innerHTML = event.parentElement.lastElementChild.innerHTML
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}
// 点击取消按钮将盒子隐藏
function cancelFn(event) {
    event.parentElement.parentElement.parentElement.classList.add('none')
}
// 当选择框变为其他时文本框出现
reportReason.onchange = function () {
    if (this.value === '0') {
        this.parentElement.nextElementSibling.classList.remove('none')
        return
    }
    this.parentElement.nextElementSibling.classList.add('none')
}
// 发送举报
function sendReportFn(event) {
    if (reportReason.value != '0' && reportReason.value == '') {
        // 没有选择举报内容
        hintFn('warning', '请选择举报内容')
        return
    }
    // 发送数据
    let obj = {
        reportId: reportId.innerHTML,
        types: 0
    }
    if (reportReason.value == '0') {
        if (otherReason.value.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
            hintFn('warning', '不能输入纯空格')
            return
        }
        obj.message = judgeStr(otherReason.value)
    } else {
        obj.message = reportReason.value
    }
    sendFn('/admin/addReport', obj)
        .then(result => {
            reportHint[0].classList.add('none')
            hintFn('success', '举报成功')
        })
        .catch(err => {
            console.log(err)
        })
}
// 获取轮播图
sendFn('/picture/showCarousel', {})
    .then(result => {
        let tempStr = ''
        tempStr += `
        <div class="carouselItem">
                <a href="/album?id=${result.msg.list[2].al_id}">
                    <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[2].img_url}" onload="operatorImgFn(this)">
                </a>
            </div>
        `
        for (let i = 0; i < result.msg.list.length; i++) {
            tempStr += `
            <div class="carouselItem">
                <a href="/album?id=${result.msg.list[i].al_id}">
                    <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].img_url}" onload="operatorImgFn(this)">
                </a>
            </div>
            `
        }
        tempStr += `
        <div class="carouselItem">
                <a href="/album?id=${result.msg.list[0].al_id}">
                    <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[0].img_url}" onload="operatorImgFn(this)">
                </a>
            </div>
        `
        carouselInfo.innerHTML = tempStr
    })
    .catch(err => {
        console.log(err)
    })

// 推荐关注
let focusNowPage = 1
let focusAllPages = 0
function getFocusInfo() {
    sendFn('/picture/recommendFocus', { size: 5, beginIndex: focusNowPage })
        .then(result => {
            focusAllPages = result.msg.all_page
            let tempStr = ``
            for (let i = 0; i < result.msg.list.length; i++) {
                if (result.msg.list[i]) {
                    let tempFocusStr = ''
                    if (result.msg.list[i].focusInfo) {
                        tempFocusStr = `
                    <span class="focusSty cancelFocusSty focusOnAllSty focusOnSty" onclick="focusOnFn(this)" focusInfo="false">已关注</span>
                    `
                    } else {
                        tempFocusStr = `
                    <span class="focusSty cancelFocusSty focusOnAllSty" onclick="focusOnFn(this)" focusInfo="true">关注</span>
                    `
                    }
                    tempStr += `
                <div class="recommendedBloggers">
                        <div class="recommendedBloggersItem">
                            <a href="/userhomepage?id=${result.msg.list[i].id}">
                                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].img_url}" onload="operatorImgFn(this)">
                            </a>
                            <span class="userNameInfoItem">
                                <a href="/userhomepage?id=${result.msg.list[i].id}">${result.msg.list[i].name}</a>
                                <p>介绍:${result.msg.list[i].describes}</p>
                            </span>
                            <span>
                                ${tempFocusStr}
                                <div class="none">${result.msg.list[i].id}</div>
                            </span>
                        </div>
                    </div>
                `
                }
            }
            let watchMore = `
        <!-- 查看更多 -->
                    <div class="watchMore">
                        <a href="/focusOnMore">
                            查看更多
                            <i class="iconfont">&#xe65f;</i>
                        </a>
                    </div>
        `
            focusOnContent.innerHTML = tempStr + watchMore

        })
        .catch(err => {
            console.log(err)
        })
}

getFocusInfo()

function focusChangeFn() {
    if (focusNowPage >= focusAllPages) {
        focusNowPage = 0
    }
    focusNowPage++
    getFocusInfo()
}

// 关注函数
function focusOnFn(event) {
    judgeLogin()
        .then(result => {
            // 判断是关注还是取消关注
            if (event.getAttribute('focusInfo') == 'true') {
                // 关注
                sendFn('/li/admin/addFocus', { focusId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        event.setAttribute('focusInfo', false)
                        event.classList.add('focusOnSty')
                        event.innerHTML = '已关注'
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return
            }
            // 取消关注
            sendFn('/li/admin/deleteFocus', { focusId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    event.setAttribute('focusInfo', true)
                    event.classList.remove('focusOnSty')
                    event.innerHTML = '关注'
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}

// 获取热内容
function getcarouselAll() {
    sendFn('/picture/ShowHotContent', {})
        .then(result => {
            let tempStr = ''
            carouselOne.innerHTML = `
            <a href="/search?message=${result.msg[0]}&type=图片">
                    <span>精选</span>
                    <span>${result.msg[0]}</span>
                </a>
            `
            let len = result.msg.length > 9 ? 9 : result.msg.length
            for (let i = 1; i < len; i++) {
                tempStr += `
                <a href="/search?message=${result.msg[i]}&type=图片">${result.msg[i]}</a>
                `
            }
            carouselRightAll.innerHTML = tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
getcarouselAll()