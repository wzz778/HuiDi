let classify_list = document.getElementsByClassName('classify-list');
let arrow_right = document.getElementsByClassName('arrow-right');

// console.log(arrow.length);
let flag = true;
arrow_right[0].onclick = function(){
    // console.log(flag);
    if(flag == true){
        let angle = 90;
        arrow_right[0].style.transform = "rotate("+angle +"deg)";
        flag = false;
    }else{
        arrow_right[0].style.transform = 'rotate(0)';
        flag = true;
    }
}