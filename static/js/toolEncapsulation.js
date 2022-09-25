// 判断字符串是否是纯空格并替换掉输入的标签
function judgeStr(str) {
    // 判断是否是全空格
    if (str.replace(/(^\s*)|(\s*$)/g, "") == "") {
        return false
    }
    // 将字符串中的标签替换
    str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return str
}

// 判断文件格式(图片)与大小
let imgResultArr = ['image/png', 'image/jpeg']
function judgeFileImg(fileTemp, size) {
    let resultObj = {}
    if (fileTemp.size > 1024 * size) {
        resultObj.reason = '上传文件太大了'
        resultObj.result = false
        return resultObj
    }
    if (!imgResultArr.indexOf(fileTemp.type)) {
        resultObj.reason = '请上传图片'
        resultObj.result = false
        return resultObj
    }
    resultObj.reason = '符合规定'
    resultObj.result = true
    return resultObj
}