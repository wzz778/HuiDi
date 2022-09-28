// 判断字符串是否是纯空格并替换掉输入的标签
function judgeStr(str) {
    // 判断是否是全空格
    // if (str.replace(/(^\s*)|(\s*$)/g, "") == "") {
    //     return false
    // }
    // 将字符串中的标签替换
    str = str.replace(/(^\s*)|(\s*$)/g, "").replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return str
}

// 判断文件格式(图片)与大小
let imgResultArr = ['image/png', 'image/jpeg']
function judgeFileImg(fileTemp, size) {
    let resultObj = {}
    if (fileTemp.size > (1024 * 1024 * size)) {
        resultObj.reason = '上传文件太大了'
        resultObj.result = false
        return resultObj
    }
    if (imgResultArr.indexOf(fileTemp.type) == -1) {
        resultObj.reason = '请上传图片'
        resultObj.result = false
        return resultObj
    }
    resultObj.reason = '符合规定'
    resultObj.result = true
    return resultObj
}
// 提示文本信息(默认是错误)
function hintFn(hintType, hintText) {
    let tempType = document.getElementsByClassName(hintType) || document.getElementsByClassName('wrong')
    tempType[0].classList.add('animatedSty')
    tempType[0].classList.remove('none')
    let tempTextEle = `${hintType}Text`
    let hintTextEle = document.getElementById(tempTextEle) || document.getElementById('wrongText')
    hintTextEle.innerHTML = hintText || '操作失败'
    // 1秒后将其隐藏
    setTimeout(() => {
        tempType[0].classList.remove('animatedSty')
        tempType[0].classList.add('none')
    }, 2000)
}

// 发送函数
function sendFn(url, obj) {
    return new Promise((resolve, resject) => {
        axios({
            method: 'POST',
            url: url,
            data: obj
        })
            .then(result => {
                resolve(result.data)
            })
            .catch(err => {
                resject(err)
            })
    })
}