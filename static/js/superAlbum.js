// 上传的图片
let file = document.getElementById('file')
// 上传文字
let clickChangeText = document.getElementById('clickChangeText')
// 显示的图片
let showImg = document.getElementById('showImg')
// 弹窗
let Popup = document.getElementsByClassName('Popup')

// 取消弹窗
function cancelUploadFn(event) {
    event.parentElement.parentElement.parentElement.classList.add('none')
}
// 上传了图片
file.onchange = function () {
    // 判断文件格式(这里限制的是2M)
    let resultObj = judgeFileImg(file.files[0], 2)
    if (!resultObj.result) {
        hintFn('warning', resultObj.reason)
        // 清空不符合规定的文件
        file.value = ''
        return
    }
    // 图片符合规定实现预览
    if (file.files.length != 0) {
        clickChangeText.innerHTML = '修改图片'
    }
    let url = window.URL.createObjectURL(file.files[0])
    showImg.src = url
}

function uploadFile(event) {
    event.setAttribute('onclick', 'uploadIng()')
    if (!file.value) {
        hintFn('warning', '请上传图片')
        return
    }
    let formdata = new FormData()
    formdata.append('file', file.files[0])
    formdata.append('alId', window.location.search.split("=")[1])
    sendFn('/superAdmin/addCarousel', formdata)
        .then(result => {
            console.log('添加结果', result)
            if (result.msg.data == 'success') {
                Popup[0].classList.add('none')
                hintFn('success', '添加成功')
                event.setAttribute('onclick', 'uploadFile(this)')
                return
            }
            hintFn('wrong', '上传文件错误，请重试')
        })
        .catch(err => {
            console.log(err)
        })
}
function uploadIng() {
    hintFn('warning', '上传中，请稍后')
}

function popupShowFn() {
    Popup[0].classList.remove('none')
}