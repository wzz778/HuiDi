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

// 获取专辑信息
function getAlbumInfo() {
    sendFn('/picture/showAlbumById', { alId: window.location.search.split("=")[1], beginIndex: nowPage })
        .then(result => {
            console.log(result)
            let userAlbumInfoStr = `
        <h1>${result.msg.album.a_name}</h1>
        <!-- 专辑情况 -->
        <div class="albumInfo">
            <span class="allImgs">总作品数</span>
            <span class=""></span>
            <span class="allCollect">${result.msg.image.all_count}</span>
        </div>
        <div class="albumWriterInfo">
            <a href="javascript:;">
                <img src="${defaultImgUrl}" alt="" data-url="${result.msg.user.img_url}" onload="operatorImgFn(this)">
                <span>${result.msg.user.name}</span>
            </a>
            <span class="yearData">${result.msg.album.create_time}</span>
        </div>
            `
            userAlbumInfo.innerHTML = userAlbumInfoStr
            let contenStr = ''
            for (let i = 0; i < result.msg.image.list.length; i++) {
                
            }

        })
        .catch(err => {
            console.log(err)
        })
}
getAlbumInfo()