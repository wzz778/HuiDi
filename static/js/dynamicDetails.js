// 评论的父盒子
let Comment = document.getElementsByClassName('Comment')
// 回复评论
let subcommentBox = document.getElementsByClassName('subcommentBox')
// 评论中的图片
let imgFile = document.getElementById('imgFile')
// 添加图片的文本提示
let clickChangeText = document.getElementById('clickChangeText')
// 展示图片的盒子
let showImg = document.getElementsByClassName('showImg')
// 图片预览的img标签
let showImgUrl = document.getElementById('showImgUrl')
// 评论的内容
let CommentInfo = document.getElementById('CommentInfo')
// 存放评论的父盒子
let allCommentsContent = document.getElementsByClassName('allCommentsContent')
// 没有数据的盒子
let noContent = document.getElementsByClassName('noContent')
// 举报的弹窗
let reportHint = document.getElementsByClassName('reportHint')
// 举报选择原因
let reportReason = document.getElementById('reportReason')

// 点击取消按钮将盒子隐藏
function cancelFn(event) {
    event.parentElement.parentElement.parentElement.classList.add('none')
}
// 当选择框变为其他时文本框出现
reportReason.onchange = function () {
    if (this.value === '0') {
        console.log(this.value)
        this.parentElement.nextElementSibling.classList.remove('none')
        return
    }
    this.parentElement.nextElementSibling.classList.add('none')
}

// 点击显现和收起评论按钮
function showCommentBoxFn() {
    Comment[0].classList.toggle('CommentStyChange')
}
// 点击取消收起评论
function closeCommentBoxFn(event) {
    Comment[0].classList.toggle('CommentStyChange')
}
// 上传了图片
imgFile.onchange = function () {
    // 判断文件格式(这里限制的是2M)
    let resultObj = judgeFileImg(imgFile.files[0], 2)
    if (!resultObj.result) {
        hintFn('warning', resultObj.reason)
        // 清空不符合规定的文件
        imgFile.value = ''
        return
    }
    // 图片符合规定实现预览
    if (imgFile.files.length != 0) {
        clickChangeText.innerHTML = '修改图片'
    }
    showImg[0].classList.remove('none')
    let url = window.URL.createObjectURL(imgFile.files[0])
    showImgUrl.src = url
}
// 删除上传的文件
function delShowImg() {
    imgFile.value = ''
    showImg[0].classList.add('none')
    clickChangeText.innerHTML = '添加图片'
}
// 发布评论
function sendCommentFn() {
    let tempStr = judgeStr(CommentInfo.value)
    // 判断值是否为空
    if (imgFile.files.length == 0 && tempStr.length == 0) {
        hintFn('warning', '请输入评论内容，且评论不能为纯空格')
        return
    }
    // 判断是否需要把盒子显现
    if (allCommentsContent[0].classList.value.indexOf('none')) {
        allCommentsContent[0].classList.remove('none')
        noContent[0].classList.add('none')
    }
    var formData = new FormData()
    if (imgFile.files[0]) {
        formData.append('file', imgFile.files[0])
    }
    formData.append('content', tempStr)
    formData.append('level', 1)
    formData.append('superId', 0)
    formData.append('reflectId',22)
    sendComment(formData)
        .then(result => {
            addComment()
            showCommentBoxFn()
            CommentInfo.value = ''
        })
        .catch(err => {
            hintFn('warning', '操作失败')
        })
}
// 评论添加到指定盒子中
function addComment() {
    var myDate = new Date()
    let imgStr = ''
    if (showImgUrl.src != 'http://127.0.0.1:8099/dynamicDetails') {
        imgStr = `<img src="${showImgUrl.src}" alt="">`
    }
    let tempStr = `
    <div class="allCommentsContentItem">
                <div class="commentUserInfo clearFloat">
                    <a href="javascript:;" class="floatLeft">
                        <img class="userImg" src="/public/img/album1.jpg" alt="">
                    </a>
                    <span class="sendInfo floatLeft">
                        <a href="javascript:;" class="userName">夜星</a>
                        <span class="sendDate">${myDate.getMonth() + 1}月${myDate.getDate()}日 ${myDate.getHours()}:${myDate.getMinutes()}</span>
                    </span>
                    <span class="floatRight commentsOperator">
                        <span class="onmouseShow">
                            <button class="operatorBtn" onclick="delCommentFn(this)">删除</button>
                            <button class="operatorBtn" onclick='reportFn(this)'>举报</button>
                        </span>
                        <button class="reply operatorBtn" onclick="replyFn(this)">回复</button>
                        <span class="dividingLine"></span>
                        <span class="likeSty">
                            <i class="iconfont">&#xec7f;</i>
                            <span>0</span>
                        </span>
                    </span>
                </div>
                <div class="commentsContent">
                    <p>${judgeStr(CommentInfo.value)}</p>
                    ${imgStr}
                    <!-- 回复框 -->
                </div>
            </div>
    `
    allCommentsContent[0].innerHTML = tempStr + allCommentsContent[0].innerHTML
    // 将值清空
    imgFile.value = ''
    delShowImg()
}

// 删除评论
function delCommentFn(event) {
    event.parentElement.parentElement.parentElement.parentElement.remove()
    // 判断是否还有评论
    let tempLength = allCommentsContent[0].getElementsByTagName('div').length
    if (tempLength == 0) {
        allCommentsContent[0].classList.add('none')
        noContent[0].classList.remove('none')
    }
}
// 点击回复盒子显现(要把对应的盒子显现)
function replyFn(event) {
    if (event.parentElement.parentElement.nextElementSibling.lastElementChild.nodeName != 'DIV') {
        let str = `
    <div class="subcommentBox clearFloat">
                        <textarea id="" cols="30" rows="10" placeholder="说些什么吧"></textarea>
                        <div class="floatRight">
                            <button class="cancelSty" onclick="cancelReplyFn(this)" >取消</button>
                            <button class="sendSty" onclick='replyCommentFirstFn(this)'>发送</button>
                        </div>
                    </div>
    `
        event.parentElement.parentElement.nextElementSibling.innerHTML += str
    }
}
// 取消回复按钮移除盒子
function cancelReplyFn(event) {
    event.parentElement.parentElement.remove()
}

// 回复子评论盒子显现
function replayCommentShowFn(event) {
    if (event.parentElement.lastElementChild.nodeName != 'DIV') {
        let str = `
    <div class="subcommentBox clearFloat">
                        <textarea id="" cols="30" rows="10" placeholder="说些什么吧"></textarea>
                        <div class="floatRight">
                            <button class="cancelSty" onclick="cancelReplyFn(this)" >取消</button>
                            <button class="sendSty" onclick='replyCommentSonFn(this)'>发送</button>
                        </div>
                    </div>
    `
        event.parentElement.innerHTML += str
    }
}
// 回复主评论
function replyCommentFirstFn(event) {
    let tempStr = judgeStr(event.parentElement.parentElement.firstElementChild.value)
    if (tempStr.length == 0) {
        hintFn('warning', '请输入评论内容，且评论不能为纯空格')
        return
    }
    let tempObj = {
        sendUrl: 'javascript:;',
        sendSrc: '/public/img/album1.jpg',
        sendName: '夜星XY',
        value: tempStr,
        replyName: '123',
        replySrc: '/public/img/album1.jpg',
        replyUrl: 'javascript:;'
    }
    addCommentSonComment(event, tempObj)
}
// 回复二级评论
function replyCommentSonFn(event) {
    let tempStr = judgeStr(event.parentElement.parentElement.firstElementChild.value)
    if (tempStr.length == 0) {
        hintFn('warning', '请输入评论内容，且评论不能为纯空格')
        return
    }
    let tempObj = {
        sendUrl: 'javascript:;',
        sendSrc: '/public/img/album1.jpg',
        sendName: '夜星XY',
        value: tempStr,
        replyName: '123',
        replySrc: '/public/img/album1.jpg',
        replyUrl: 'javascript:;'
    }
    addCommentSonComment(event.parentElement.parentElement, tempObj)
}
// 将回复的评论添加到盒子中
function addCommentSonComment(event, commentObj) {
    var myDate = new Date()
    let tempStr = `
    <div class="replyCommnetBox">
                    <div class="replyCommnetItem">
                        <!-- 回复人 -->
                        <div class="replyInfo">
                            <a href="${commentObj.sendUrl}" class="replyUserName">
                                <img src="${commentObj.sendSrc}" alt="">
                                <span>${commentObj.sendName}</span>
                            </a>
                            <span>回复</span>
                            <!-- 回复的人 -->
                            <a href="${commentObj.replyUrl}" class="replyUserName">
                                <img src="${commentObj.replySrc}" alt="">
                                <span>${commentObj.replyName}</span>
                            </a>
                        </div>
                        <!-- 回复信息 -->
                        <div class="replyCommnetContent">
                        ${commentObj.value}
                        </div>
                        <div class="replyCommneBottom">
                            <span class="replyCommnetDate">${myDate.getMonth() + 1}月${myDate.getDate()}日 ${myDate.getHours()}:${myDate.getMinutes()}</span>
                            <!-- 举报按钮 -->
                            <button>
                                <i class="iconfont">&#xe69b;</i>
                            </button>
                            <!-- 点赞 -->
                            <button>
                                <i class="iconfont">&#xec7f;</i>
                                <span>1</span>
                            </button>
                            <button onclick="replayCommentShowFn(this)">回复</button>
                            <button onclick="delReplyCommentFn(this)">删除</button>
                            <button onclick='reportFn(this)'>举报</button>
                        </div>
                    </div>
                </div>
    `
    event.parentElement.parentElement.parentElement.parentElement.innerHTML += tempStr
}
// 删除回复评论
function delReplyCommentFn(event) {
    event.parentElement.parentElement.parentElement.remove()
}
// 举报弹窗显现
function reportFn(event) {
    reportHint[0].classList.remove('none')
}

// 收藏函数
function collectFn(event) {
    // 判断是收藏还是取消收藏
    if (event.classList.value.indexOf('clickOperator') != -1) {
        // 取消收藏
        sendFn('/admin/deleteCollect', { id: 22 })
            .then(result => {
                console.log(result)
                event.classList.remove('clickOperator')
                event.lastElementChild.innerHTML--
            })
            .catch(err => {
                hintFn('warning', '操作失败')
            })
        return
    }
    sendFn('/admin/addCollect', { imgId: 22, uId: 3 })
        .then(result => {
            console.log(result)
            event.classList.add('clickOperator')
            event.lastElementChild.innerHTML++
        })
        .catch(err => {
            hintFn('warning', '操作失败')
        })
}
// 点赞函数
function likeFn(event) {
    // 判断是收藏还是取消收藏
    if (event.classList.value.indexOf('clickOperator') != -1) {
        // 取消收藏
        sendFn('/admin/deleteLike', { reflectId: 22, uId: 3 })
            .then(result => {
                console.log(result)
                event.classList.remove('clickOperator')
                event.lastElementChild.innerHTML--
            })
            .catch(err => {
                hintFn('warning', '操作失败')
            })
        return
    }
    sendFn('/admin/pointLike', { uId: 22, reflectId: 3 })
        .then(result => {
            console.log(result)
            event.classList.add('clickOperator')
            event.lastElementChild.innerHTML++
        })
        .catch(err => {
            hintFn('warning', '操作失败')
        })
}

// 请求渲染数据
function renderAllCommnetFn() {
    let tempResult = getAllComment(22)
    if (!tempResult.result) {
        // 获取数据失败
        return
    }
    if (tempResult.msg.length == 0) {
        allCommentsContent[0].classList.add('none')
        noContent[0].classList.remove('none')
        return
    }
    // 遍历数据
    let tempStr = ''
    for (let i = 0; i < tempResult.msg.length; i++) {
        tempStr = `
        <div class="allCommentsContentItem">
                <div class="commentUserInfo clearFloat">
                    <a href="javascript:;" class="floatLeft">
                        <img class="userImg" src="/public/img/album1.jpg" alt="">
                    </a>
                    <span class="sendInfo floatLeft">
                        <a href="javascript:;" class="userName">夜星XY</a>
                        <span class="sendDate">9月24日 10:33</span>
                    </span>
                    <span class="floatRight commentsOperator">
                        <span class="onmouseShow">
                            <button class="operatorBtn" onclick="delCommentFn(this)">删除</button>
                            <button class="operatorBtn" onclick='reportFn(this)'>举报</button>
                        </span>
                        <button class="reply operatorBtn" onclick="replyFn(this)">回复</button>
                        <span class="dividingLine"></span>
                        <span class="likeSty">
                            <i class="iconfont">&#xec7f;</i>
                            <span>0</span>
                        </span>
                    </span>
                </div>
                <!-- 内容 -->
                <div class="commentsContent">
                    <p>11111111111111111111111111111111111111111111111111111111111111</p>
                    <img src="/public/img/myImg1.jpg" alt="">
                    <!-- 回复框 -->
                </div>
                <!-- 评论的回复盒子 -->
            </div>
        `
    }
}

// 请求所有评论函数
function getAllComment(obj) {
    sendFn('/admin/showComment', obj)
        .then(result => { })
        .catch(err => { })
}
// 发布评论数据
function sendComment(sendObj) {
    return new Promise((resolve, resject) => {
        sendFn('/admin/publicComment', sendObj)
            .then(result => {
                console.log(result)
                resolve(result)
            })
            .catch(err => {
                console.log(err)
                resject(err)
            })
    })
}