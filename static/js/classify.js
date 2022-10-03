let classify_list = document.getElementsByClassName('classify-list');
let arrow_right = document.getElementsByClassName('arrow-right');
let btn_new = document.getElementsByClassName('btn-new');
let hidden = document.getElementsByClassName('hidden');
let btn_confirm = document.getElementsByClassName('btn-confirm');
let btn_cancel = document.getElementsByClassName('btn-cancel');
let classifier_list = document.getElementsByClassName('classifier-input');
let classifies = document.getElementsByClassName('classifies');
let news = document.getElementsByClassName('new');
let btn_update = document.getElementsByClassName('btn-update');
let btn_delete = document.getElementsByClassName('btn-delete');
// console.log(arrow.length);



classifier_list[0].oninput = function(){
    this.value = this.value.replace(/\s*/g,"");
}

btn_new[0].onclick = function(){
    hidden[0].style.display = 'block';
    btn_new[0].numbers = 0;
}

btn_confirm[0].onclick = function(){
    console.log(classifier_list[0].value);
    if(btn_new[0].numbers == 0){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/addTypes',
                params:{
                    name:classifier_list[0].value,
                    level:1,
                }
            }).then(result =>{
                console.log(result.data);
            })
            hidden[0].style.display = 'none';
        }
    }else if(btn_new[0].numbers == 1){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/addTypess',
                params:{
                    name:classifier_list[0].value,
                    level:1,
                    super_id:btn_new[0].super_id
                }
            }).then(result =>{
                console.log(result.data);
            })
            hidden[0].style.display = 'none';
        }
    }else if(btn_new[0].numbers == 2){
        
    }
}

btn_cancel[0].onclick = function(){
    hidden[0].style.display = 'none';
}

function renders(){
    axios({
        method:'GET',
        url:'/superAdmin/showAllType',
    }).then(result =>{
        console.log(result.data);
        let all = '';
        let All = ''
        for(let i=0;i<result.data.msg.length;i++){
            all +=`<div class="classify-list">
                        <img src="public/iconfont/arrow3.png" alt="" class="arrow arrow-right">
                        <span class="classify-name">${result.data.msg[i].type.name}</span>
                        <div class="func">
                            <button class="btn btn-update">修改</button>
                            <button class="btn new">新增</button>
                            <button class="btn btn-delete">删除</button>
                        </div>
                    </div>`
            if(result.data.temps[i][0] == -1){
                console.log(1);
                all += `<div class="second-level">
                            
                        </div>`
            }else{

            }
        
        }
        classifies[0].innerHTML =  all;
        for(let j=0;j<result.data.msg.length;j++){
            arrow_right[j].flag = true;
            arrow_right[j].onclick = function(){
                // console.log(flag);
                if(this.flag == true){
                    let angle = 90;
                    arrow_right[j].style.transform = "rotate("+angle +"deg)";
                    this.flag = false;
                }else{
                    arrow_right[j].style.transform = 'rotate(0)';
                    this.flag = true;
                }
            }
            news[j].onclick = function(){
                btn_new[0].numbers = 1;
                btn_new[0].super_id = result.data.msg[j].type.id;
            }
            btn_update[j].onclick = function(){
                btn_new[0].numbers = 2;
                btn_new[0].ids = result.data.msg[j].type.id;
            }
        }
    })
}
renders();