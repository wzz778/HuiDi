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
// 专辑信息
let albumInfo = document.getElementById('albumInfo')
// 用户信息
let userInfo = document.getElementById('userInfo')
// 内容
let detailsWorks = document.getElementById('detailsWorks')
// 显示作品相关点赞收藏信息
let operatorItem = document.getElementById('operatorItem')
// 关注
let foucs = document.getElementById('foucs')
// 存放举报的信息
let sendReportInfo = document.getElementById('sendReportInfo')
// 动画
let animation = document.getElementById('animation')

let sendArrNone = []

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
// 发布主评论
function sendCommentFn() {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            // 判断是否能发布评论
            if (new Date() < Date.parse(result.userInfo.end_time)) {
                // 被封号不能发布评论
                hintFn('warning', `改账号被封${result.userInfo.end_time}`)
                return
            }
            let userObj = result.userInfo
            let tempStr = judgeStr(CommentInfo.value)
            // 判断值是否为空
            if (imgFile.files.length == 0 && tempStr.length == 0) {
                hintFn('warning', '请输入评论内容，且评论不能为纯空格')
                return
            }
            // 判断是否需要把盒子显现
            if (allCommentsContent[0].classList.value.indexOf('none') != -1) {
                allCommentsContent[0].classList.remove('none')
                noContent[0].classList.add('none')
                animation.classList.remove('none')
            }
            var formData = new FormData()
            if (imgFile.files[0]) {
                formData.append('file', imgFile.files[0])
            }
            formData.append('content', tempStr)
            formData.append('level', 1)
            formData.append('superId', 0)
            formData.append('reflectId', window.location.search.split("=")[1])
            formData.append('reportId', 0)
            sendFn('/admin/publicComment', formData)
                .then(result => {
                    userObj.commentId = result.msg[0].id
                    sendArrNone.push(result.msg[0].id)
                    // 将评论的id传过来
                    addComment(userObj)
                    showCommentBoxFn()
                    CommentInfo.value = ''
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(err => {
            // 未登录
            hintFn('warning', '请先登录')
        })

}
// 补全时间
function dataCompletion(date) {
    return date < 10 ? '0' + date : date
}
// (主)评论添加到指定盒子中
function addComment(userObj) {
    noContent[0].classList.add('none')
    animation.classList.remove('none')
    allCommentsContent[0].classList.remove('none')
    let myDate = new Date()
    let imgStr = ''
    if (showImgUrl.src.indexOf('/dynamicDetails?id=') == -1) {
        imgStr = `<img src="${showImgUrl.src}" alt="">`
    }
    let userObjInfo = {
        name: userObj.name,
        imgUrl: userObj.img_url,
        id: userObj.id,
        commentId: userObj.commentId,
    }
    let tempStr = `
    <div class="allCommentsContentItem">
                <div class="none">
                    ${JSON.stringify(userObjInfo)}
                </div>
                <div class="commentUserInfo clearFloat">
                    <a href="/userhomepage?id=${userObj.id}" class="floatLeft">
                        <img class="userImg" src="${userObj.img_url}" alt="">
                    </a>
                    <span class="sendInfo floatLeft">
                        <a href="/userhomepage?id=${userObj.id}" class="userName">${userObj.name}</a>
                        <span class="sendDate">${myDate.getFullYear()}-${dataCompletion(myDate.getMonth() + 1)}-${dataCompletion(myDate.getDate())} ${dataCompletion(myDate.getHours())}:${dataCompletion(myDate.getMinutes())}:${dataCompletion(myDate.getSeconds())}</span>
                    </span>
                    <span class="floatRight commentsOperator">
                        <span class="onmouseShow">
                            <div class="none">${JSON.stringify({ commentId: userObj.commentId, userId: userObj.id })}</div>
                            <button class="operatorBtn" onclick="delCommentFn(this)">删除</button>
                            <button class="operatorBtn" onclick='reportFn(this)'>举报</button>
                        </span>
                        <button class="reply operatorBtn" onclick="replyFn(this)">回复</button>
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
    // 判断是否登录
    judgeLogin()
        .then(result => {
            // 判断是不是自己的评论
            if (!true) {
                hintFn('warning', '您只能删除您自己的评论')
                return
            }
            // 删除评论接口
            return sendFn('/admin/deleteComment', { id: JSON.parse(event.parentElement.firstElementChild.innerHTML).commentId, userId: JSON.parse(event.parentElement.firstElementChild.innerHTML).userId })
        })
        .then(result => {
            if (result.err == 0) {
                event.parentElement.parentElement.parentElement.parentElement.remove()
                // 判断是否还有评论
                let tempLength = allCommentsContent[0].getElementsByTagName('div').length
                if (tempLength == 0) {
                    allCommentsContent[0].classList.add('none')
                    noContent[0].classList.remove('none')
                    animation.classList.add('none')
                    return
                }
                return
            }
            // 不能删除他人的评论
            hintFn('warning', '您不能删除他人评论')
        })
        .catch(err => {
            console.log(err)
            hintFn('warning', '请先登录')
        })
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
        event.parentElement.innerHTML = str + event.parentElement.innerHTML
    }
}
// 回复主评论
function replyCommentFirstFn(event) {
    let replyObj = JSON.parse(event.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML)
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            if (new Date() < Date.parse(result.userInfo.end_time)) {
                // 被封号不能发布评论
                hintFn('warning', `改账号被封${result.userInfo.end_time}`)
                return
            }
            let tempStr = judgeStr(event.parentElement.parentElement.firstElementChild.value)
            if (tempStr.length == 0) {
                hintFn('warning', '请输入评论内容，且评论不能为纯空格')
                return
            }
            let tempObj = {
                sendUrl: `/userhomepage?id=${result.userInfo.id}`,
                sendSrc: result.userInfo.img_url,
                sendName: result.userInfo.name,
                content: tempStr,
                replyName: replyObj.name,
                replySrc: replyObj.imgUrl,
                replyUrl: `/userhomepage?id=${replyObj.id}`,
                superId: replyObj.commentId,
                reflectId: window.location.search.split("=")[1],
                id: result.userInfo.id,
                level: 2,
                reportId: replyObj.id
            }
            addCommentSonComment(event, tempObj)
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}
// 回复二级评论
function replyCommentSonFn(event) {
    judgeLogin()
        .then((result) => {
            if (new Date() < Date.parse(result.userInfo.end_time)) {
                // 被封号不能发布评论
                hintFn('warning', `改账号被封${result.userInfo.end_time}`)
                return
            }
            let tempStr = judgeStr(event.parentElement.parentElement.firstElementChild.value)
            if (tempStr.length == 0) {
                hintFn('warning', '请输入评论内容，且评论不能为纯空格')
                return
            }
            let tempObj = {
                sendUrl: `/userhomepage?id=${result.userInfo.id}`,
                sendSrc: result.userInfo.img_url,
                sendName: result.userInfo.name,
                content: tempStr,
                replyName: JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).userName,
                replySrc: JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).userImg,
                replyUrl: `/userhomepage?id=${JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).userId}`,
                superId: JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).commentId,
                reflectId: window.location.search.split("=")[1],
                level: 2,
                reportId: JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).userId,
                id: JSON.parse(event.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML).userId
            }
            addCommentSonComment(event.parentElement.parentElement, tempObj)
        })
        .catch((err) => {
            console.log(err)
            hintFn('warning', '请先登录')
        })
}
// 将回复的评论添加到盒子中
function addCommentSonComment(event, commentObj) {
    // 判断是否登录
    judgeLogin()
        .then(() => {
            if (new Date() < Date.parse(result.userInfo.end_time)) {
                // 被封号不能发布评论
                hintFn('warning', `改账号被封${result.userInfo.end_time}`)
                return
            }
            // 发布评论
            return sendFn('/admin/publicComment', commentObj)
        })
        .then(result => {
            let tempObj = {
                userId: commentObj.id,
                commentId: result.msg[0].id,
                userName: commentObj.sendName,
                userImg: commentObj.sendSrc
            }
            let myDate = new Date()
            let tempStr = `
    <div class="replyCommnetBox">
                    <div class="none">${JSON.stringify(tempObj)}</div>
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
                        ${commentObj.content}
                        </div>
                        <div class="replyCommneBottom">
                            <div class="none">${JSON.stringify(tempObj)}</div>
                            <span class="sendDate">${myDate.getFullYear()}-${dataCompletion(myDate.getMonth() + 1)}-${dataCompletion(myDate.getDate())} ${dataCompletion(myDate.getHours())}:${dataCompletion(myDate.getMinutes())}:${dataCompletion(myDate.getSeconds())}</span>
                            <button onclick="replayCommentShowFn(this)">回复</button>
                            <button onclick="delReplyCommentFn(this)">删除</button>
                            <button onclick='reportFn(this)'>举报</button>
                        </div>
                    </div>
                </div>
    `
            let tempEle = event.parentElement.parentElement.parentElement.parentElement
            tempEle.innerHTML += tempStr
            tempEle.getElementsByTagName('textarea')[0].parentElement.remove()
        })
        .catch(err => {
            console.log(err)
            // 未登录
            hintFn('warning', '请先登录')
        })
}
// 删除回复评论
function delReplyCommentFn(event) {
    judgeLogin()
        .then(() => {
            return sendFn('/admin/deleteComment', { id: JSON.parse(event.parentElement.firstElementChild.innerHTML).commentId, userId: JSON.parse(event.parentElement.firstElementChild.innerHTML).userId })
        })
        .then(result => {
            event.parentElement.parentElement.parentElement.remove()
        })
        .catch(err => {
            console.log(err)
            // 未登录
            hintFn('warning', '请先登录')
        })
}

// 收藏函数
function collectFn(event) {
    // 判断是否登录
    judgeLogin()
        .then((result) => {
            // 判断是收藏还是取消收藏
            if (event.classList.value.indexOf('clickOperator') != -1) {
                // 取消收藏
                sendFn('/admin/deleteCollect', { id: window.location.search.split("=")[1] })
                    .then(result => {
                        event.classList.remove('clickOperator')
                        event.lastElementChild.innerHTML--
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/addCollect', { imgId: window.location.search.split("=")[1], uId: result.userInfo.id })
                .then(result => {
                    event.classList.add('clickOperator')
                    event.lastElementChild.innerHTML++
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
            // 判断是收藏还是取消收藏
            if (event.classList.value.indexOf('clickOperator') != -1) {
                // 取消收藏
                sendFn('/admin/deleteLike', { reflectId: window.location.search.split("=")[1] })
                    .then(result => {
                        event.classList.remove('clickOperator')
                        event.lastElementChild.innerHTML--
                    })
                    .catch(err => {
                        hintFn('warning', '操作失败')
                    })
                return
            }
            sendFn('/admin/pointLike', { reflectId: window.location.search.split("=")[1] })
                .then(result => {
                    event.classList.add('clickOperator')
                    event.lastElementChild.innerHTML++
                })
                .catch(err => {
                    hintFn('warning', '操作失败')
                })
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}


// 请求所有评论函数
let allPges = 0
let nowPage = 1
function getAllComment() {
    sendFn('/picture/showComment', { id: window.location.search.split("=")[1], beginIndex: nowPage })
        .then(result => {
            allPges = result.msg.all_page
            // 将数据渲染到页面中
            let tempStr = ''
            if (result.msg.list.length == 0) {
                // 没有数据
                noContent[0].classList.remove('none')
                animation.classList.add('none')
            }
            for (let i = 0; i < result.msg.list.length; i++) {
                if (sendArrNone.indexOf(result.msg.list[i].comment.id) != -1) {
                    continue
                }
                let replyTempStr = ''
                if (result.msg.list[i].commentList) {
                    // 遍历二级评论
                    for (let j = 0; j < result.msg.list[i].commentList.length; j++) {
                        let commentSonDel = ''
                        if (result.msg.login && result.msg.login == result.msg.list[i].commentList[j].comment.ob.u_id.id) {
                            commentSonDel = `<button onclick="delReplyCommentFn(this)">删除</button>`
                        }
                        let tempObj = {
                            userId: result.msg.list[i].commentList[j].comment.ob.u_id.id,
                            userImg: result.msg.list[i].commentList[j].comment.ob.u_id.img_url,
                            userName: result.msg.list[i].commentList[j].comment.ob.u_id.name,
                            commentId: result.msg.list[i].comment.id
                        }
                        replyTempStr += `
                <div class="replyCommnetBox">
                    <div class="none">${JSON.stringify(tempObj)}</div>
                    <div class="replyCommnetItem">
                        <!-- 回复人 -->
                        <div class="replyInfo">
                            <a href="/userhomepage?id=${result.msg.list[i].commentList[j].comment.ob.u_id.id}" class="replyUserName">
                                <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].commentList[j].comment.ob.u_id.img_url}" onload="operatorImgFn(this)">
                                <span>${result.msg.list[i].commentList[j].comment.ob.u_id.name}</span>
                            </a>
                            <span>回复</span>
                            <!-- 回复的人 -->
                            <a href="/userhomepage?id=${result.msg.list[i].commentList[j].comment.ob.report_id.id}" class="replyUserName">
                                <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].commentList[j].comment.ob.report_id.img_url}" onload="operatorImgFn(this)">
                                <span>${result.msg.list[i].commentList[j].comment.ob.report_id.name}</span>
                            </a>
                        </div>
                        <!-- 回复信息 -->
                        <div class="replyCommnetContent">
                            ${result.msg.list[i].commentList[j].comment.content}
                        </div>
                        <div class="replyCommneBottom">
                            <div class="none">${JSON.stringify({ commentId: result.msg.list[i].commentList[j].comment.id, userId: result.msg.list[i].commentList[j].comment.ob.u_id.id })}</div>
                            <span class="replyCommnetDate">${result.msg.list[i].commentList[j].comment.create_time}</span>
                            <button onclick="replayCommentShowFn(this)">回复</button>
                            ${commentSonDel}
                            <button onclick='reportFn(this)'>举报</button>
                        </div>
                    </div>
                </div>
                `
                    }
                }
                let imgStr = ''
                if (result.msg.list[i].comment.img_url) {
                    imgStr = `<img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].comment.img_url}" onload="operatorImgFn(this)">`
                }
                let commentDel = ``
                if (result.msg.login && result.msg.login == result.msg.list[i].comment.ob.u_id.id) {
                    commentDel = `<button class="operatorBtn" onclick="delCommentFn(this)">删除</button>`
                }
                let userObj = {
                    name: result.msg.list[i].comment.ob.u_id.name,
                    imgUrl: result.msg.list[i].comment.ob.u_id.img_url,
                    id: result.msg.list[i].comment.ob.u_id.id,
                    commentId: result.msg.list[i].comment.id
                }
                tempStr += `
            <div class="allCommentsContentItem">
                <div class="none">${JSON.stringify(userObj)}</div>
                <div class="commentUserInfo clearFloat">
                    <a href="/userhomepage?id=${result.msg.list[i].comment.ob.u_id.id}" class="floatLeft">
                        <img class="userImg" src="${defaultImgUrl}" alt="" data-url="${result.msg.list[i].comment.ob.u_id.img_url}" onload="operatorImgFn(this)">
                    </a>
                    <span class="sendInfo floatLeft">
                        <a href="/userhomepage?id=${result.msg.list[i].comment.ob.u_id.id}" class="userName">${result.msg.list[i].comment.ob.u_id.name}</a>
                        <span class="sendDate">${result.msg.list[i].comment.create_time}</span>
                    </span>
                    <span class="floatRight commentsOperator">
                        <span class="onmouseShow">
                            <div class="none">${JSON.stringify({ commentId: result.msg.list[i].comment.id, userId: result.msg.list[i].comment.ob.u_id.id })}</div>
                            ${commentDel}
                            <button class="operatorBtn" onclick='reportFn(this)'>举报</button>
                        </span>
                        <button class="reply operatorBtn" onclick="replyFn(this)">回复</button>
                    </span>
                </div>
                <!-- 内容 -->
                <div class="commentsContent">
                    <p>${result.msg.list[i].comment.content}</p>
                    ${imgStr}
                    <!-- 回复框 -->
                </div>
                <!-- 评论的回复盒子 -->
                ${replyTempStr}
            </div>
            
            `
            }
            allCommentsContent[0].innerHTML += tempStr
        })
        .catch(err => {
            console.log(err)
        })
}
getAllComment()
// 获取指定id的信息
sendFn('/picture/showInfoMessage', { id: window.location.search.split("=")[1] })
    .then(result => {
        // 修改专辑的src
        albumInfo.href = `/album?albumId=${result.msg.album.id}`
        // 将专辑信息显现
        let imgStr = ''
        for (let j = 0; j < 1; j++) {
            imgStr += `<img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[j]}" onload="operatorImgFn(this)">`
        }
        let tempAlbumStr = `
    <div class="contentRightItem">
        ${imgStr}
        <div class="">
            <span>${result.msg.album.a_name}</span>
            <span>
                <span>创建时间</span>
                <span></span>
                <span>${result.msg.album.create_time.split(' ')[0]}</span>
            </span>
        </div>
    </div>
        `
        albumInfo.innerHTML = tempAlbumStr
        // 用户信息
        let tempUserStr = `
                    <a class="/userhomepage?id=${result.msg.users.id}">
                        <img src="${defaultImgUrl}" alt="" data-url="${result.msg.users.img_url}" onload="operatorImgFn(this)">
                    </a>
                    <span class="userNameItem">
                        <span>
                            <a href="/userhomepage?id=${result.msg.users.id}">
                                ${result.msg.users.name}
                            </a>
                        </span>
                        <span>${result.msg.images.create_time}</span>
                        <div class="none">${result.msg.users.id}</div>
                    </span>
        `
        userInfo.innerHTML = tempUserStr
        let tempWorkImages = ''
        for (let j = 0; j < result.msg.list.length; j++) {
            tempWorkImages += ` <img src="${defaultImgUrl}" alt="" data-url="${result.msg.list[j]}" onload="operatorImgFn(this)">`
        }
        let tempWorksStr = `
                <p>${result.msg.images.describes}</p>
               ${tempWorkImages}
        `
        let tempLikeStr = ''
        let tempCollectStr = ''
        // 点赞信息
        if (result.msg.images.like) {
            // 点赞了
            tempLikeStr = `
        <div class="">
            <button class="operatorItemBtn clickOperator" onclick="likeFn(this)">
                <i class="iconfont">&#xec7f;</i>
                <span>${result.msg.images.likeNum}</span>
            </button>
        </div>
            `
        } else {
            tempLikeStr = `
            <div class="">
                <button class="operatorItemBtn" onclick="likeFn(this)">
                    <i class="iconfont">&#xec7f;</i>
                    <span>${result.msg.images.likeNum}</span>
                </button>
            </div>
                `
        }

        // 收藏信息
        if (result.msg.images.collect) {
            tempCollectStr = `
                <div class="">
                    <button class="operatorItemBtn clickOperator" onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.images.collectNum}</span>
                    </button>
                </div>
            `
        } else {
            tempCollectStr = `
                <div class="">
                    <button class="operatorItemBtn" onclick="collectFn(this)">
                        <i class="iconfont">&#xebae;</i>
                        <span>${result.msg.images.collectNum}</span>
                    </button>
                </div>
            `
        }
        detailsWorks.innerHTML = tempWorksStr
        operatorItem.innerHTML = `
                ${tempLikeStr}
                <div class="">
                    <button class="operatorItemBtn" onclick="showCommentBoxFn()">
                        <i class="iconfont">&#xe614;</i>
                        <span>评论</span>
                    </button>
                </div>
                ${tempCollectStr}
                <div class="">
                    <button class="operatorItemBtn" onclick='reportFn(this,0)'>
                        <i class="iconfont">&#xe601;</i>
                        <span>举报</span>
                    </button>
                </div>
        
        `
        return sendFn('/admin/checkFocus', { uId: foucs.parentElement.firstElementChild.lastElementChild.lastElementChild.innerHTML })
    })
    .then(result => {
        // 添加关注或取消关注函数
        foucs.setAttribute('onclick', 'focusOnFn(this)')
        if (result.msg) {
            // 关注了
            foucs.classList.add('focusOnSty')
            foucs.innerHTML = '已关注'
        }
    })
    .catch(err => {
        console.log(err)
    })

// 关注函数
function focusOnFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(result => {
            if (event.classList.value.indexOf('focusOnSty') == -1) {
                // 关注
                sendFn('/li/admin/addFocus', { focusId: event.parentElement.firstElementChild.lastElementChild.lastElementChild.innerHTML })
                    .then(result => {
                        event.classList.add('focusOnSty')
                        event.innerHTML = '已关注'
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return
            }
            // 取消关注
            sendFn('/li/admin/deleteFocus', { focusId: event.parentElement.firstElementChild.lastElementChild.lastElementChild.innerHTML })
                .then(result => {
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

// 举报弹窗显现
function reportFn(event, type) {
    judgeLogin()
        .then(result => {
            reportHint[0].classList.remove('none')
            if (type == 0) {
                // 举报作品
                sendReportInfo.innerHTML = `${JSON.stringify({
                    reportId: window.location.search.split("=")[1],
                    types: 0
                })
                    }`
                return
            }
            // 举报评论
            sendReportInfo.innerHTML = `${JSON.stringify({
                reportId: JSON.parse(event.parentElement.firstElementChild.innerHTML).commentId,
                types: 1
            })}`
        })
        .catch(err => {
            console.log(err)
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
// 发送举报(作品)
function sendReportFn(event) {
    if (reportReason.value != '0' && reportReason.value == '') {
        // 没有选择举报内容
        hintFn('warning', '请选择举报内容')
        return
    }
    // 发送数据
    let obj = JSON.parse(sendReportInfo.innerHTML)
    if (reportReason.value == '0') {
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

// 监听滚轮
window.onmousewheel = function (event) {
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
    if (nowPage == allPges) {
        yn = false
        animation.classList.add('none')
    }
    // 提示没有内容了
    if (event.wheelDelta < 0 && !yn && nowPage == allPges) {
        // 判断是否该提示没有数据了
        if (scrollHeightOther <= scrollTop + windowHeight) {
            hintFn('warning', '没有更多内容了')
        }
    }
    if (offsetHeight < viewHeight + scrollHeight && event.wheelDelta < 0 && yn) {
        nowPage++
        getAllComment()
    }
}