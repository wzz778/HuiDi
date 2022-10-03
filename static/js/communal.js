// let forbiding = document.getElementsByClassName('forbiding');
let page_current = document.getElementsByClassName('page-current');
let page_left = document.getElementsByClassName('page-left');
let page_right = document.getElementsByClassName('page-right'); 
let page_input = document.getElementsByClassName('page-input');
let pageSize = document.getElementsByClassName('pageSize');

// forbiding[0].onclick = function(){
//     hidden[0].style.display = 'block';
// }

function renderPaging(name,maxLength){
    console.log(maxLength);
    pageSize[0].onchange = function(){
        console.log(this.value,page_current[0].innerHTML);
        name(page_current[0].innerHTML,pageSize[0].value);
    }
    page_left[0].onclick = function(){
        let num = page_current[0].innerText;
        if(page_current[0].innerHTML == 1){
    
        }else{
            num--;
            page_right[0].style.cursor = 'pointer';
            page_current[0].innerHTML = num;
            name(page_current[0].innerHTML,pageSize[0].value);
            if(page_current[0].innerHTML == 1){
                page_left[0].style.cursor = 'not-allowed';
            }
        }
    }
    
    if(maxLength == 1){
        page_right[0].style.cursor = 'not-allowed';
        
    }else{
        page_right[0].onclick = function(){
            let num = page_current[0].innerText;
            if(page_current[0].innerHTML > maxLength){
                
            }else{
                num++;
                page_left[0].style.cursor = 'pointer';
                page_current[0].innerHTML = num;
                name(page_current[0].innerHTML,pageSize[0].value);
                if(page_current[0].innerHTML == 100){
                    page_right[0].style.cursor = 'not-allowed';
                }
            }
        }
    }

    page_input[0].oninput = function(){
        this.value=this.value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');
        if (this.value / 1 > maxLength) {
            this.value = this.value + "";
            this.value = this.value.slice(0, this.value.length - 1);
        }
    }
    page_input[0].addEventListener('keydown',function(e){
        if(e.keyCode == 13){
            console.log(1);
            page_current[0].innerHTML = page_input[0].value;
        }
    })
}
