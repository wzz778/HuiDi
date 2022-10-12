// 选择是否下架作品
let shelves = document.getElementById('shelves')
// 选择是否封号该作者
let titles = document.getElementById('titles')
// 选择时间
let dateChoice = document.getElementById('dateChoice')
// 举报弹窗页面
let reportAccept = document.getElementsByClassName('reportAccept')

// 取消显示
function cancelShowFn(event) {
    event.parentElement.parentElement.parentElement.classList.add('none')
}
// 显示弹窗
function popupShowFn() {
    reportAccept[0].classList.remove('none')
}
// 监听是否封号
titles.onchange = function () {
    dateChoice.value = ''
    this.parentElement.nextElementSibling.classList.add('none')
    if (this.value == '') {
        return
    }
    if (this.value == '1') {
        this.parentElement.nextElementSibling.classList.remove('none')
        return
    }
}
// 提交
function sureReportFn() {
    if (shelves.value == '') {
        hintFn('warning', '请选择是否下架作品')
        return
    }
    if (titles.value == '') {
        hintFn('warning', '请选择是否封号')
        return
    }
    if (titles.value == '1' && dateChoice.value == '') {
        hintFn('warning', '请选择封号时间')
        return
    }
    // 判断时间是否正确
    if (dateChoice.value != '' && Date.parse(new Date()) > Date.parse(dateChoice.value)) {
        // 时间不正确
        hintFn('warning', '请选择正确时间')
        return
    }
    console.log(dateChoice.value)
    // 修改时间样式
    if (shelves.value == '否' && titles.value == '0') {
        reportAccept[0].classList.add('none')
        return
    }
    // 判断是单独下架作品还是单独封号或者封号和下架
    let sendArr = []
    if (shelves.value == '是') {
        // 压入下架作品
        sendArr.push(sendFn('/theShelves', { id: window.location.search.split("=")[1] }))
    }
    if (titles.value == '1') {
        // 压入封号
        sendArr.push(sendFn('/superAdmin/updateUserStatus', { id: window.location.search.split("=")[1], endTime: changeDateSty(dateChoice.value) }))
    }
    Promise.all(sendArr)
        .then(result => {
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
}
// 修改时间样式
function changeDateSty(tempDate) {
    let tempArr = tempDate.split('T')
    console.log(tempArr)
    let tempStr = `${tempArr[0]} ${tempArr[1]}:00`
    console.log(tempStr)
    return tempStr
}