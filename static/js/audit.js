let card_body_main = document.getElementsByClassName('card-body-main');
let pass = document.getElementsByClassName('pass');
let reject = document.getElementsByClassName('reject');
let confirm = document.getElementsByClassName('confirm');
let cancel = document.getElementsByClassName('cancel');
let hidden = document.getElementsByClassName('hidden');
let warn_text = document.getElementsByClassName('warn-text');
let classifier_input = document.getElementsByClassName('classifier-input');
let detail = document.getElementsByClassName('details');
let pageings = document.getElementsByClassName('pageings');
let confirmes = document.getElementsByClassName('confirmes');
let warn_texts = document.getElementsByClassName('warn-texts');
let warnings = document.getElementsByClassName('warnings');
classifier_input[0].oninput = function(){
    this.value = this.value.replace(/\s*/g,"");
}


// 渲染页面
function renders(begin_index,size){
    axios({
        method:'GET',
        url:'/superAdmin/showAllNoPass',
        params:{
            begin_index:begin_index,
            size:size
        }
    }).then(result =>{
        console.log(result.data);
        pageings[0].maxLength = result.data.msg.all_page
        pageings[0].all_size = result.data.msg.all_count
        pageings[0].cur_index = result.data.msg.cur_index;
        pageings[0].size = result.data.msg.size;
        let all = '';
        for(let i=0;i<result.data.msg.list.length;i++){
            if(result.data.msg.list[i].list.length == 0){
                all +=`<ul class="card-body-list">
                        <li class="card-list-number audit-change">${i+1}</li>
                        <li class="card-list-name audit-change">${result.data.msg.list[i].users.name}</li>
                        <li class="card-list-name audit-change">${result.data.msg.list[i].album.types}</li>
                        <li class="card-list-sex audit-change">${result.data.msg.list[i].images.describes}</li>
                        <li class="card-list-status audit-change">
                            <img src="public/img/nothing.png" alt="" class="content-img">
                        </li>
                        <li class="card-list-mail audit-change">${result.data.msg.list[i].images.create_time}</li>
                        <li class="card-list-other audit-change">
                            <button class="btn details">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
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
            }else{
                all +=`<ul class="card-body-list">
                        <li class="card-list-number audit-change">${i+1}</li>
                        <li class="card-list-name audit-change">${result.data.msg.list[i].users.name}</li>
                        <li class="card-list-name audit-change">${result.data.msg.list[i].album.types}</li>
                        <li class="card-list-sex audit-change">${result.data.msg.list[i].images.describes}</li>
                        <li class="card-list-status audit-change">
                            <img src="${result.data.msg.list[i].list[0]}" alt="" class="content-img">
                        </li>
                        <li class="card-list-mail audit-change">${result.data.msg.list[i].images.create_time}</li>
                        <li class="card-list-other audit-change">
                            <button class="btn details">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
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
        card_body_main[0].innerHTML = all;
        generatePagination(result.data.msg.all_page,result.data.msg.size,result.data.msg.cur_index,result.data.msg.all_count,renders,-1);
        for(let j=0;j<result.data.msg.list.length;j++){
            pass[j].onclick = function(){
                pass[0].ids = result.data.msg.list[j].images.id;
                warn_text[0].innerHTML = '确定通过作评内容为：' + result.data.msg.list[j].images.describes + '嘛？'
                hidden[1].style.display = 'block'
            }
            reject[j].onclick = function(){
                pass[1].ids = result.data.msg.list[j].images.id;
                hidden[0].style.display = 'block'
            }
            detail[j].addEventListener('click',function(){
                console.log(1);
                window.location.href = 'detail?id=' + result.data.msg.list[j].images.id;
            })
        }
    })
}
renders(1,5);

cancel[0].onclick = function(){
    classifier_input[0].value = ''
    hidden[0].style.display = 'none'
}
confirm[0].onclick = function(){
    if(classifier_input[0].value != ''){
        axios({
            method:'GET',
            url:'/superAdmin/updatePass',
            params:{
                id:pass[1].ids,
                massage:classifier_input[0].value
            }
        }).then(result =>{
            console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[0].style.display = 'none'
                hidden[2].style.display = 'block'
                warn_texts[0].innerHTML = '驳回成功'
                warnings[0].src = 'public/iconfont/success.png'
                renders(pageings[0].cur_index,pageings[0].size,-1);
                classifier_input[0].value = ''
            }
            
        })
    }else{
        hidden[2].style.display = 'block'
        warn_texts[0].innerHTML = '请把信息填写完整'
        warnings[0].src = 'public/iconfont/warn2.png'
    }
}
cancel[1].onclick = function(){
    classifier_input[0].value = ''
    hidden[1].style.display = 'none'
}
confirm[1].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/updateStatus',
        params:{
            id:pass[0].ids
        }
    }).then(result =>{
        console.log(result.data);
        if(result.data.msg == 'success'){
            hidden[1].style.display = 'none'
            hidden[2].style.display = 'block'
            warn_texts[0].innerHTML = '审核通过'
            warnings[0].src = 'public/iconfont/success.png'
            renders(pageings[0].cur_index,pageings[0].size,-1);
            classifier_input[0].value = ''
        }
        hidden[1].style.display = 'none'
        renders(pageings[0].cur_index,pageings[0].size,-1);
    })
}


confirmes[0].onclick = function(){
    hidden[2].style.display = 'none';
}