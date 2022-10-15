let defaultImgUrl = '/public/img/onlanding.gif'
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
let imgArr = ['image/png', 'image/jpeg']
function judgeFileImg(fileTemp, size) {
    let resultObj = {}
    if (fileTemp.size > (1024 * 1024 * size)) {
        resultObj.reason = '上传文件太大了'
        resultObj.result = false
        return resultObj
    }
    if (imgArr.indexOf(fileTemp.type) == -1) {
        resultObj.reason = '请上传图片'
        resultObj.result = false
        return resultObj
    }
    resultObj.reason = '符合规定'
    resultObj.result = true
    return resultObj
}
let tipsback = document.getElementById('tipsback');
// 提示文本信息(默认是错误)
function hintFn(hintType, hintText) {
    let tempType = document.getElementsByClassName(hintType) || document.getElementsByClassName('wrong')
    tempType[0].classList.add('animatedSty')
    tempType[0].classList.remove('none')
    tipsback.style.display = 'block';
    let tempTextEle = `${hintType}Text`
    let hintTextEle = document.getElementById(tempTextEle) || document.getElementById('wrongText')
    hintTextEle.innerHTML = hintText || '操作失败'
    // 1秒后将其隐藏
    setTimeout(() => {
        tempType[0].classList.remove('animatedSty')
        tempType[0].classList.add('none')
        tipsback.style.display = 'none';
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

// 判断是否登录
function judgeLogin() {
    return new Promise((resolve, resject) => {
        axios({
            method: 'POST',
            url: '/judgeLogin',
        })
            .then(result => {
                if (result.data.msg) {
                    // 登录了
                    resolve(result.data)
                } else {
                    resject()
                }
            })
            .catch(err => {
                resject()
            })
    })
}


// 图片加载优化
class PreLoadImage {
    constructor(imgNode) {
        // 获取真实的DOM节点
        this.imgNode = imgNode
    }
    // 操作img节点的src属性
    setSrc(imgUrl) {
        this.imgNode.src = imgUrl
    }
}
class ProxyImage {
    // 占位图的url地址
    static LOADING_URL = defaultImgUrl
    constructor(targetImage) {
        // 目标Image，即PreLoadImage实例
        this.targetImage = targetImage
    }
    // 该方法主要操作虚拟Image，完成加载
    setSrc(targetUrl) {
        // 真实img节点初始化时展示的是一个占位图,这里的setSrc是PreLoadImage里边的方法
        this.targetImage.setSrc(ProxyImage.LOADING_URL)
        // 创建一个帮我们加载图片的虚拟Image实例
        const virtualImage = new Image()
        // 监听目标图片加载的情况，完成时再将DOM上的真实img节点的src属性设置为目标图片的url
        virtualImage.onload = () => {
            //virtualImage图片加载好给实例赋值过去
            this.targetImage.setSrc(targetUrl)
        }
        // 设置src属性，虚拟Image实例开始加载图片
        virtualImage.src = targetUrl
        // 去除监听的img函数
        this.targetImage.imgNode.removeAttribute("onload")
    }
}
// 操作img的函数接收一个img dom元素，其下一个元素需要是图片的url地址
function operatorImgFn(event) {
    let tempEle = new PreLoadImage(event)
    let operatorEle = new ProxyImage(tempEle)
    if (!event.getAttribute('data-url') || event.getAttribute('data-url') == 'null' || event.getAttribute('data-url') == 'undefined') {
        return
    }
    operatorEle.setSrc(event.getAttribute('data-url'))
}
