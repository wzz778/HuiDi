// 轮播图
let carousel = document.getElementsByClassName('carousel')
let carouselPoints = document.getElementsByClassName('carouselPoints')[0].getElementsByTagName('span')
// 定义一个变量用于看是第几个图片
let carouselIndex = 0
// 开始定时器
let timerIndex = ''
// 定时器
function beginSettimeout() {
    timerIndex = setInterval(() => {
        carouselIndex++
        carouselIndex = carouselIndex % 3
        carousel[0].style.left = (-carouselIndex * 760) + "px"
        // 将所有点的样式清除
        for (let i = 0; i < carouselPoints.length; i++) {
            carouselPoints[i].classList.remove('clickCarouselPoints')
        }
        carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
    }, 1500)
}
beginSettimeout()

// 点击跳转到指定图片
function clickJump(num) {
    carouselIndex = num
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
    clearInterval(timerIndex)
}

function endSettimeout() {
    clearInterval(timerIndex)
}

// 点击左箭头
function leftArrow() {
    clearInterval(timerIndex)
    if (carouselIndex == 0) {
        carouselIndex = 3
    }
    carouselIndex--
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}
// 点击右箭头
function rightArrow() {
    clearInterval(timerIndex)
    carouselIndex++
    carouselIndex = carouselIndex % 3
    carousel[0].style.left = (-carouselIndex * 760) + "px"
    for (let i = 0; i < carouselPoints.length; i++) {
        carouselPoints[i].classList.remove('clickCarouselPoints')
    }
    carouselPoints[carouselIndex].classList.add('clickCarouselPoints')
}

// 首页左边导航栏
let centerMiddle = document.getElementsByClassName('centerMiddle')
let navOperatorChoice=document.getElementsByClassName('navOperatorChoice')
function navFn(show,close) {
    centerMiddle[close].style.display='none'
    centerMiddle[show].style.display='block'
    // 为其添加样式
    navOperatorChoice[show].classList.add('navChoiceSty')
    navOperatorChoice[show].firstElementChild.classList.add('navTextChoiceSty')
    // 移除样式
    navOperatorChoice[close].classList.remove('navChoiceSty')
    navOperatorChoice[close].firstElementChild.classList.remove('navTextChoiceSty')
}