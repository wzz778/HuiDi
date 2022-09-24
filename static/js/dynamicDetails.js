// 评论的父盒子
let Comment=document.getElementsByClassName('Comment')

// 点击显现和收起评论按钮
function showCommentBoxFn() {
    Comment[0].classList.toggle('CommentStyChange')
}