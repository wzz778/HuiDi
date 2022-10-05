// 所有的专辑的父盒子
let allAlbum = document.getElementById('allAlbum')
// 收集弹窗的父盒子
let collectHint = document.getElementsByClassName('collectHint')
// 存放其他专辑的ul
let albumHad = document.getElementsByClassName('albumHad')
// 选择专辑的结果
let albumChoiceResult = document.getElementsByClassName('albumChoiceResult')

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
// 获取专辑信息
sendFn('/picture/showAlbum', { id: window.location.search.split("=")[1] })
.then(result=>{
    
})