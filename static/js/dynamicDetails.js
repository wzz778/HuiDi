// 评论的父盒子
let Comment=document.getElementsByClassName('Comment')
// 回复评论
let subcommentBox=document.getElementsByClassName('subcommentBox')

// 点击显现和收起评论按钮
function showCommentBoxFn() {
    Comment[0].classList.toggle('CommentStyChange')
}

// 点击回复(要把对应的盒子显现)
function replyFn(event) {
    event.parentElement.parentElement.nextElementSibling.lastElementChild.classList.remove('CommentStyChange')
}
// 取消回复按钮
function cancelReplyFn(event) {
    event.parentElement.parentElement.parentElement.lastElementChild.classList.add('CommentStyChange')
}