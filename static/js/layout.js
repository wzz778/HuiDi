let header=document.getElementById('header');
let header_button=document.getElementsByClassName('header_button')[0];
let header_button_i=header_button.getElementsByTagName('i')[0];
let header_class=document.getElementsByClassName('header_class')[0];
header_button.onmousemove = function() {
    header_class.style.display='block';
    header_button_i.classList.add("arrowtora");
    header_button_i.style.transform = ("rotate(-180deg)");
}
header_button.onmouseout = function() {
    header_class.style.display='none';
    header_button_i.classList.remove("arrowtora");
    header_button_i.style.transform = ("rotate(0deg)");
}
header_class.onmousemove = function() {
    header_class.style.display='block';
    header_button_i.classList.add("arrowtora");
    header_button_i.style.transform = ("rotate(-180deg)");
}
header_class.onmouseout = function() {
    header_class.style.display='none';
    header_button_i.classList.remove("arrowtora");
    header_button_i.style.transform = ("rotate(0deg)");
}
function Topfun() {
    four = setInterval(FourscrollBy, 8);
}
function FourscrollBy() {
    if (document.documentElement && document.documentElement.scrollTop) {
        if (document.documentElement.scrollTop <= 0) {
            clearInterval(four);
        } else {
            window.scrollBy(0, -30);
        }
    } else {
        if (document.body.scrollTop <= 0) {
            clearInterval(four);
        } else {
            window.scrollBy(0, -30);
        }
    }
}
