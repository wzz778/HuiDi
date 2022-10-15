// 存放类别的父盒子
let choiceFocus = document.getElementById('choiceFocus')
// 内容区
let content = document.getElementById('content')
// 动画
let animation = document.getElementById('animation')
// 没有内容
let noContent = document.getElementById('noContent')
// 搜索内容
let message = ''
let all = 0

// 点击去请求函数
choiceFocus.addEventListener('click', (event) => {
    let allSpans = choiceFocus.getElementsByTagName('span')
    if (message == '') {
        message = '全部'
    }
    if (event.target.innerHTML.indexOf(message) != -1) {
        return
    }
    content.innerHTML = ''
    // 清除所有样式
    for (let i = 0; i < allSpans.length; i++) {
        allSpans[i].classList.remove('clickSty')
        allSpans[i].setAttribute('nowPage', 1)
        allSpans[i].setAttribute('allPage', 0)
    }
    event.target.classList.add('clickSty')
    getFocusOnInfo(event.target)
    event.preventDefault()
})

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
            console.log(err)
            hintFn('warning', '请先登录')
        })
}
// 关注类别
sendFn('/picture/showRecommendType', {})
    .then(result => {
        let tempStr = `<span class="clickSty" allPage=0 nowPage=1>全部</span>`
        for (let i = 0; i < result.msg.length; i++) {
            tempStr += ` <span allPage=0 nowPage=1>${result.msg[i].area_name}</span>`
        }
        choiceFocus.innerHTML = tempStr
        return sendFn('/picture/FindUsersRecommendationCategories', {
            nowPage: getChoiceFn().getAttribute('nowPage'),
            type: ''
        })
    })
    .then(result => {
        getChoiceFn().setAttribute('allPage', result.msg.all_page)
        let tempStr = ''
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
// 获取关注的信息
function getFocusOnInfo(ele) {
    message = ele.innerHTML == '全部' ? '' : `${ele.innerHTML}达人`
    sendFn('/picture/FindUsersRecommendationCategories', { type: message, nowPage: ele.getAttribute('nowPage') })
        .then(result => {
            animation.classList.remove('none')
            noContent.classList.add('none')
            content.classList.remove('none')
            all = result.msg.all_count
            if (result.msg.all_count < 5) {
                animation.classList.add('none')
            }
            if (result.msg.list.length == 0) {
                animation.classList.add('none')
                noContent.classList.remove('none')
                content.classList.add('none')
                return
            }
            ele.setAttribute('allPage', result.msg.all_page)
            let tempStr = ''
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
            content.innerHTML += tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
// 判断当前是那个一个类别
function getChoiceFn() {
    let allSpans = choiceFocus.getElementsByTagName('span')
    for (let i = 0; i < allSpans.length; i++) {
        if (allSpans[i].classList.value.indexOf('clickSty') != -1) {
            return allSpans[i]
        }
    }
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
    let yn = true
    let ele = getChoiceFn()
    let nowPage = ele.getAttribute('nowPage')
    let allPages = ele.getAttribute('allPage')
    // 没有数据了
    if (nowPage >= allPages) {
        yn = false
        animation.classList.add('none')
    }
    // 提示没有内容了
    if (event.wheelDelta < 0 && !yn && nowPage >= allPages) {
        // 判断是否该提示没有数据了
        if (scrollHeightOther <= scrollTop + windowHeight) {
            if(all==content.getElementsByClassName('item').length){
                hintFn('warning', '没有更多内容了')
            }
        }
    }
    if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && yn) {
        nowPage++
        ele.setAttribute('nowPage', nowPage)
        getFocusOnInfo(ele)
    }
}