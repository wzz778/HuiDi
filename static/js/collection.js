let card_body_main = document.getElementsByClassName('card-body-main');
let pass = document.getElementsByClassName('pass');
let reject = document.getElementsByClassName('reject');
let hidden = document.getElementsByClassName('hidden');
let cancel = document.getElementsByClassName('cancel');
let confirm = document.getElementsByClassName('confirm');
let warn_text = document.getElementsByClassName('warn-text');
let classifier_input = document.getElementsByClassName('classifier-input');
// let reject = document.getElementsByClassName('reject');

classifier_input[0].oninput = function(){
    this.value = this.value.replace(/\s*/g,"");
}

function renders(begin_index,size,numbers){
    axios({
        method:'GET',
        url:'/superAdmin/showAlbum',
        params:{
            begin_index:begin_index,
            size:size,
            status:numbers,
        }
    }).then(result =>{
        console.log(result.data);
        page_current[0].maxNumber = result.data.msg.all_page
        page_current[0].all_size = result.data.msg.all_count
        page_current[0].cur_index = result.data.msg.cur_index
        page_current[0].size = result.data.msg.size
        page_current[0].number = numbers
        let st = '李四'
        let all = ''
        for(let i=0;i<result.data.msg.list.length;i++){
            let status = '';
            if(result.data.msg.list[i].status == 0){
                status = '未审核'
            }else if(result.data.msg.list[i].status == 1){
                status = '审核通过'
            }else if(result.data.msg.list[i].status == 2){
                status = '未通过'
            }
            if(result.data.msg.list[i].describes == null){
                let describes = '无'
                if(result.data.msg.list[i].status == 1){
                    all +=`<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].a_name}</li>
                        <li class="card-list-status">${status}</li>
                        <li class="card-list-mail">${describes}</li>
                        <li class="card-list-timer">${result.data.msg.list[i].create_time}</li>
                        <li class="card-list-other">
                                <button class="btn pass ">
                                    <img src="public/iconfont/see.png" alt="" class="forbid chang-forbid">
                                    显示
                                </button>
                                <button class="btn reject ">
                                    <img src="public/iconfont/add.png" alt="" class="forbid chang-forbid">
                                    添加
                                </button>
                        </li>
                    </ul>`
                }else{
                    all +=`<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].a_name}</li>
                        <li class="card-list-status">${status}</li>
                        <li class="card-list-mail">${describes}</li>
                        <li class="card-list-timer">${result.data.msg.list[i].create_time}</li>
                        <li class="card-list-other">
                                <button class="btn pass">
                                    <img src="public/iconfont/pass.png" alt="" class="forbid ">
                                    通过
                                </button>
                                <button class="btn reject ">
                                    <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                    驳回
                                </button>
                        </li>
                    </ul>`
                }
            }else{
                if(result.data.msg.list[i].status == 1){
                    all +=`<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].a_name}</li>
                        <li class="card-list-status">${status}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].describes}</li>
                        <li class="card-list-timer">${result.data.msg.list[i].create_time}</li>
                        <li class="card-list-other">
                                <button class="btn pass ">
                                    <img src="public/iconfont/see.png" alt="" class="forbid chang-forbid">
                                    显示
                                </button>
                                <button class="btn reject ">
                                    <img src="public/iconfont/add.png" alt="" class="forbid chang-forbid">
                                    添加
                                </button>
                        </li>
                    </ul>`
                }else{
                    all +=`<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].a_name}</li>
                        <li class="card-list-status">${status}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].describes}</li>
                        <li class="card-list-timer">${result.data.msg.list[i].create_time}</li>
                        <li class="card-list-other">
                                <button class="btn pass">
                                    <img src="public/iconfont/pass.png" alt="" class="forbid">
                                    通过
                                </button>
                                <button class="btn reject">
                                    <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                    驳回
                                </button>
                        </li>
                    </ul>`
                }
            }
            
        }
        card_body_main[0].innerHTML = all;
        renderPaging(renders,page_current[0].maxNumber,page_current[0].all_size,page_current[0].number);
        for(let j=0;j<result.data.msg.list.length;j++){

            pass[j].onclick = function(){
                warn_text[0].innerHTML = '确定通过专辑名为：' + result.data.msg.list[j].a_name + '嘛？'
                confirm[1].ids = result.data.msg.list[j].id
                hidden[1].style.display = 'block'
            }
            reject[j].onclick = function(){
                confirm[0].ids = result.data.msg.list[j].id
                hidden[0].style.display = 'block'
            }
        }
    })
}
renders(1,5,0);


cancel[0].onclick = function(){
    hidden[0].style.display = 'none'
}
confirm[0].onclick = function(){
    if(classifier_input[0].value != ''){
        axios({
            method:'GET',
            url:'/superAdmin/updateAlbumStatuss',
            params:{
                id:confirm[0].ids,
                status:2,
                message:classifier_input[0].value
            }
        }).then(result =>{
            console.log(result.data);
            hidden[0].style.display = 'none'
            renders(page_current[0].cur_index,page_current[0].size,page_current[0].number)
        })
    }
}
cancel[1].onclick = function(){
    hidden[1].style.display = 'none'
}
confirm[1].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/updateAlbumStatus',
        params:{
            id:confirm[1].ids,
            status:1
        }
    }).then(result =>{
        console.log(result.data);
        hidden[1].style.display = 'none'
        renders(page_current[0].cur_index,page_current[0].size,page_current[0].number)
    })
}




// 下拉框的效果
let layer_click = document.getElementsByClassName('layer-click');
let layer_list = document.getElementsByClassName('layer-list');
let startTimes = document.getElementsByClassName('startTimes');
let flag = true;
layer_click[0].onclick = function(){
    if(flag == true){
        layer_list[0].style.display = 'block';
        flag = false;
    }else{
        layer_list[0].style.display = 'none';
        flag = true;
    }
}
function ds(){
    let index = 0;
    for(let i=0;i<startTimes.length;i++){
        startTimes[i].numbers = i;
        startTimes[i].onclick = function(){

            index = this.numbers;
            renew(index);
            layer_list[0].style.display = 'none';
            flag = true;
            let news = startTimes[index].innerHTML;
            if(news == '未审核'){
                renders(page_current[0].cur_index,page_current[0].size,0);
            }else{
                renders(page_current[0].cur_index,page_current[0].size,1);
            }
            layer_click[0].value =startTimes[index].innerHTML;
        }
    }
}
function renew(index){
    for(let i=0;i<startTimes.length;i++){
        startTimes[i].classList.remove('layer-this');
    }
    startTimes[index].classList.add('layer-this');
}
ds();