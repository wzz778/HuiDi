// 轮播图
let carousel = document.getElementsByClassName('carousel')
let carouselPoints = document.getElementsByClassName('carouselPoints')[0].getElementsByTagName('span')
// 存放热门信息的盒子
let hotTicket = document.getElementById('hotTicket')
// 定义一个变量用于看是第几个图片
let carouselIndex = 0
// 开始定时器
let timerIndex = ''
// 定时器
function beginSettimeout() {
    timerIndex = setInterval(() => {
        carouselIndex++
        carouselIndex = carouselIndex % 3
        carousel[0].style.left = (-carouselIndex * 760) + "px"
        // 将所有点的样式清除
        for (let i = 0; i < carouselPoints.length; i++) {
            carouselPoints[i].classList.remove('clickCarouselPoints')
        }
        carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
    }, 1500)
}
beginSettimeout()

// 点击跳转到指定图片
function clickJump(num) {
    carouselIndex = num
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
    clearInterval(timerIndex)
}

function endSettimeout() {
    clearInterval(timerIndex)
}

// 点击左箭头
function leftArrow() {
    clearInterval(timerIndex)
    if (carouselIndex == 0) {
        carouselIndex = 3
    }
    carouselIndex--
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}
// 点击右箭头
function rightArrow() {
    clearInterval(timerIndex)
    carouselIndex++
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}

// 首页左边导航栏
let centerMiddle = document.getElementsByClassName('centerMiddle')
let navOperatorChoice = document.getElementsByClassName('navOperatorChoice')
function navFn(show, close) {
    centerMiddle[close].style.display = 'none'
    centerMiddle[show].style.display = 'block'
    // 为其添加样式
    navOperatorChoice[show].classList.add('navChoiceSty')
    navOperatorChoice[show].firstElementChild.classList.add('navTextChoiceSty')
    // 移除样式
    navOperatorChoice[close].classList.remove('navChoiceSty')
    navOperatorChoice[close].firstElementChild.classList.remove('navTextChoiceSty')
}
let nowPage = 1
function getHotTicket() {
    sendFn('/picture/showAllPicture', { beginIndex: nowPage })
        .then(result => {
            console.log('结果', result)
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
                            <a href="javascript:;">
                                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].users.img_url}" onload="operatorImgFn(this)">
                            </a>
                            <div class="userName">
                                <!-- 用户名 -->
                                <a href="javascript:;">
                                    <span>${result.msg.list[i].users.name}</span>
                                </a>
                                <span>热门内容</span>
                            </div>
                        </div>
                        <div class="userPostContent">
                            <p>${result.msg.list[i].images.describes}</p>
                            <a href="javascript:;">
                                <div class="userPostContentAllimg">
                                    ${tempImg}
                                </div>
                            </a>
                            <div class="userWorkOperate">
                                ${tepmLike}
                                ${tempCollect}
                                <span>
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
            hotTicket.innerHTML = tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
getHotTicket()

// 点赞函数
function likeFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            // 判断是点赞还是取消点赞
            if (event.classList.value.indexOf('likeSty') == -1) {
                // 点赞
                sendFn('/admin/pointLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 添加类名
                        event.classList.add('likeSty')
                        event.lastElementChild.innerHTML++
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/deleteLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    event.classList.remove('likeSty')
                    event.lastElementChild.innerHTML--
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}
function collectFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            if (event.classList.value.indexOf('likeSty') == -1) {
                // 收藏
                sendFn('/admin/addCollect', { imgId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 添加类名
                        event.classList.add('likeSty')
                        event.lastElementChild.innerHTML++
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/deleteCollect', { id: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    console.log(result)
                    event.classList.remove('likeSty')
                    event.lastElementChild.innerHTML--
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(err => {
            hintFn('warning','请先登录')
        })
}