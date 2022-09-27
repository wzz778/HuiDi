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
    // 评论合格发布评论
    // axios({
    //     method: 'POST',
    //     url: '/admin/publicComment',
    //     data: {
    //         content: ''
    //     }
    // })
    //     .then(result => {
    //         console.log(result.data)
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    addComment()
    showCommentBoxFn()
    CommentInfo.value = ''
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
                            <button class="operatorBtn">举报</button>
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
}

// 点击回复(要把对应的盒子显现)
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
// 取消回复按钮
function cancelReplyFn(event) {
    event.parentElement.parentElement.remove()
}
// 获取所有评论
function getAllComment(id) {
    axios({
        method: 'POST',
        url: '/admin/showComment',
        data: {
            id: id
        }
    })
        .then(result => {
            console.log(result.data)
        })
        .catch(err => {
            console.log(err)
        })
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
    let tempObj={
        sendUrl:'javascript:;',
        sendSrc:'/public/img/album1.jpg',
        sendName:'夜星XY',
        value:tempStr,
        replyName:'123',
        replySrc:'/public/img/album1.jpg',
        replyUrl:'javascript:;'
    }
    addCommentSonComment(event,tempObj)
}
// 回复二级评论
function replyCommentSonFn(event) {
    let tempStr = judgeStr(event.parentElement.parentElement.firstElementChild.value)
    if (tempStr.length == 0) {
        hintFn('warning', '请输入评论内容，且评论不能为纯空格')
        return
    }
    let tempObj={
        sendUrl:'javascript:;',
        sendSrc:'/public/img/album1.jpg',
        sendName:'夜星XY',
        value:tempStr,
        replyName:'123',
        replySrc:'/public/img/album1.jpg',
        replyUrl:'javascript:;'
    }
    addCommentSonComment(event.parentElement.parentElement,tempObj)
}
// 将回复的评论添加到盒子中
function addCommentSonComment(event,commentObj){
    let tempStr=`
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
                            <span class="replyCommnetDate">2022-09-27</span>
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
                        </div>
                    </div>
                </div>
    `
    event.parentElement.parentElement.parentElement.parentElement.innerHTML+=tempStr

}