// 存放类别的父盒子
let choiceFocus = document.getElementById('choiceFocus')

// 点击去请求函数
choiceFocus.addEventListener('click', (event) => {
    let allSpans = choiceFocus.getElementsByTagName('span')
    // 清除所有样式
    for (let i = 0; i < allSpans.length; i++) {
        allSpans[i].classList.remove('clickSty')
    }
    event.target.classList.add('clickSty')
    event.preventDefault()
})

// 关注与取关函数
function focusOnFn(event) {
    // 判断是否登录
    judgeLogin()
        .then(() => {
            // 判断是关注函数取关
            if (event.classList.value.indexOf('focusSty') == -1) {
                sendFn('/admin/addFocus', { focusId: 1, uId: 3 })
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
            sendFn('/admin/deleteFocus', { focusId: 1, uId: 3 })
                .then(result => {
                    event.innerHTML = '关注'
                    event.classList.remove('focusSty')
                })
                .catch(err => {
                    hintFn('warning', '网络错误，请重试')
                })
        })
        .catch(() => {
            hintFn('warning', '请先登录')
        })
}