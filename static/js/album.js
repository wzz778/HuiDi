// 所有的专辑的父盒子
let allAlbum = document.getElementById('allAlbum')
// 收集弹窗的父盒子
let collectHint = document.getElementsByClassName('collectHint')
// 存放其他专辑的ul
let albumHad = document.getElementsByClassName('albumHad')
// 选择专辑的结果
let albumChoiceResult = document.getElementsByClassName('albumChoiceResult')
// 存放专辑和用户的信息
let userAlbumInfo = document.getElementById('userAlbumInfo')
// 存放内容
let content = document.getElementById('content')
// 动画
let animation = document.getElementById('animation')
// 没有内容
let noContent = document.getElementById('noContent')


// 点击将所有专辑显现出来
function allAlbumShow() {
    allAlbum.classList.toggle('albumHadItemShow')
}
// 点击叉号取消显示
function cancelShow(event) {
    event.parentElement.parentElement.parentElement.style.display = 'none'
}
// 点击收集盒子显现
function collectBoxShowFn(event) {
    collectHint[0].style.display = 'block'
}
// 点击每个专辑去更改选择结果
function choiceAlbumFn(event) {
    albumChoiceResult[0].innerHTML = event.innerHTML
}
let nowPage = 1
let allPages = 0
let all = 0
// 获取专辑信息
function getAlbumInfo() {
    sendFn('/picture/showAlbumById', { alId: window.location.search.split("=")[1], beginIndex: nowPage })
        .then(result => {
            all = result.msg.image.all_count
            // 判断动画是否显示
            if (all < 5) {
                animation.classList.add('none')
            }
            allPages = result.msg.image.all_page
            let userAlbumInfoStr = `
        <h1>${result.msg.album.a_name}</h1>
        <!-- 专辑情况 -->
        <div class="albumInfo">
            <span class="allImgs">总作品数</span>
            <span class=""></span>
            <span class="allCollect">${result.msg.image.all_count}</span>
        </div>
        <div class="albumWriterInfo">
            <a href="/userhomepage?id=${result.msg.user.id}">
                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.user.img_url}" onload="operatorImgFn(this)">
                <span>${result.msg.user.name}</span>
            </a>
            <span class="yearData">${result.msg.album.create_time}</span>
        </div>
            `
            userAlbumInfo.innerHTML = userAlbumInfoStr
            let contenStr = ''
            if (result.msg.image.list.length == 0) {
                noContent.classList.remove('none')
                animation.classList.add('none')
                content.classList.add('none')
                return
            }
            animation.classList.add('none')
            for (let i = 0; i < result.msg.image.list.length; i++) {
                let tempAllImg = ''
                for (let j = 0; j < result.msg.image.list[i].images.ob.length; j++) {
                    tempAllImg += `
                        <img src="${defaultImgUrl}" alt="" data-url="${result.msg.image.list[i].images.ob[j].img_url}" onload="operatorImgFn(this)">
                    `
                }
                let likeInfoStr = ''
                let likeOperatorStr = ''
                if (result.msg.image.list[i].images.like) {
                    // 点赞了
                    likeInfoStr = `
                    <span class="likeSty">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.image.list[i].images.likeNum}</span>
                    </span>
                    `
                    likeOperatorStr = `
                    <span class="myImgOperatorItem" onclick="likeFn(this)" info="false" status=${result.msg.image.list[i].images.status}>已赞</span>
                    `
                } else {
                    // 没有点赞
                    likeInfoStr = `
                    <span class="">
                        <i class="iconfont">&#xec7f;</i>
                        <span>${result.msg.image.list[i].images.likeNum}</span>
                    </span>
                    `
                    likeOperatorStr = `
                    <span class="myImgOperatorItem" onclick="likeFn(this)" info="true" status=${result.msg.image.list[i].images.status}>点赞</span>
                    `
                }
                let collectInfoStr = ''
                let collectOperatorStr = ''
                if (result.msg.image.list[i].images.collect) {
                    collectInfoStr = `
                    <span class="likeSty">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.image.list[i].images.collectNum}</span>
                    </span>
                    `
                    collectOperatorStr = `
                    <span class="myImgOperatorItem" onclick="collectFn(this)" info="false" status=${result.msg.image.list[i].images.status}>已收藏</span>
                    `
                } else {
                    collectInfoStr = `
                    <span class="">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.image.list[i].images.collectNum}</span>
                    </span>
                    `
                    collectOperatorStr = `
                    <span class="myImgOperatorItem" onclick="collectFn(this)" info="true" status=${result.msg.image.list[i].images.status}>收藏</span>
                    `
                }
                contenStr += `
                <div class="contentItem">
            <div class="">
                <div class="myImg">
                    <span href="/dynamicDetails?id=${result.msg.image.list[i].images.id}" onclick="jumpFn(this)" status=${result.msg.image.list[i].images.status}>
                       ${tempAllImg}
                    </span>
                    <div class="myImgOperator">
                        ${likeOperatorStr}
                        ${collectOperatorStr}
                        <span class="myImgOperatorItem">
                            <a href="/dynamicDetails?id=${result.msg.image.list[i].images.id}">评论</a>
                        </span>
                        <div class="none">${result.msg.image.list[i].images.id}</div>
                    </div>
                </div>
                <!-- 文本说明 -->
                <div class="myImgTextItem">
                    <p class="myImgText">${result.msg.image.list[i].images.describes}</p>
                </div>
                <div class="myImgOperatorShow">
                    ${likeInfoStr}
                    ${collectInfoStr}
                </div>
            </div>
        </div>
                `
            }
            content.innerHTML += contenStr
        })
        .catch(err => {
            console.log(err)
        })
}
getAlbumInfo()

// 点赞或取消点赞
function likeFn(event) {
    judgeLogin()
        .then(result => {
            if (event.getAttribute('status') == 0 || event.getAttribute('status') == 2) {
                hintFn('warning', '该动态未通过审核')
                return
            }
            // 登录了,判断是点赞还是取消点赞
            if (event.getAttribute('info') == 'true') {
                // 点赞
                sendFn('/admin/pointLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 修改最后一个数据
                        event.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.classList.add('likeSty')
                        event.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.lastElementChild.innerHTML++
                        event.setAttribute('info', false)
                        event.innerHTML = '已赞'
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return
            }
            sendFn('/admin/deleteLike', { reflectId: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    // 修改最后一个数据
                    event.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.classList.remove('likeSty')
                    event.parentElement.parentElement.parentElement.lastElementChild.firstElementChild.lastElementChild.innerHTML--
                    event.setAttribute('info', true)
                    event.innerHTML = '点赞'
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}
// 收藏函数
function collectFn(event) {
    judgeLogin()
        .then(result => {
            if (event.getAttribute('status') == 0 || event.getAttribute('status') == 2) {
                hintFn('warning', '该动态未通过审核')
                return
            }
            // 登录了,判断是收藏还是取消收藏
            if (event.getAttribute('info') == 'true') {
                // 点赞
                sendFn('/admin/addCollect', { imgId: event.parentElement.lastElementChild.innerHTML })
                    .then(result => {
                        // 修改最后一个数据
                        event.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.classList.add('likeSty')
                        event.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.lastElementChild.innerHTML++
                        event.innerHTML = '已收藏'
                        event.setAttribute('info', false)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return
            }
            sendFn('/admin/deleteCollect', { id: event.parentElement.lastElementChild.innerHTML })
                .then(result => {
                    // 修改最后一个数据
                    event.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.classList.remove('likeSty')
                    event.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.lastElementChild.innerHTML--
                    event.innerHTML = '收藏'
                    event.setAttribute('info', true)
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            hintFn('warning', '请先登录')
        })
}

// 监听滚轮
window.onmousewheel = function (event) {
    animation.classList.remove('none')
    // 视口的高度
    const viewHeight = document.documentElement.clientHeight
    // 滚动条高度
    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
    const offsetHeight = animation.offsetTop
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop // 滚动条距离顶部的距离
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight // 可视区的高度
    let scrollHeightOther = document.documentElement.scrollHeight || document.body.scrollHeight //dom元素的高度，包含溢出不可见的内容
    let yn = true
    // 没有数据了
    if (nowPage >= allPages) {
        yn = false
        animation.classList.add('none')
        noContent.classList.remove('none')
    }
    // 提示没有内容了
    if (event.wheelDelta < 0 && !yn && nowPage == allPages) {
        // 判断是否该提示没有数据了
        if (scrollHeightOther <= scrollTop + windowHeight) {
            if (content.getElementsByClassName('contentItem').length == all) {
                noContent.classList.remove('none')
            }
        }
    }
    if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && yn) {
        nowPage++
        getAlbumInfo()
    }
}
// 跳转
function jumpFn(event) {
    if (event.getAttribute('status') == 0 || event.getAttribute('status') == 2) {
        hintFn('warning', '该动态未通过审核')
        return
    }
    window.location.href = event.getAttribute('href')
}