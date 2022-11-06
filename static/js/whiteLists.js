


let forbiding = document.getElementsByClassName('forbiding');
let cancel = document.getElementsByClassName('cancel');
let confirms  = document.getElementsByClassName('confirm')
let hidden = document.getElementsByClassName('hidden');
let hiddens = document.getElementsByClassName('hiddens');
let seal = document.getElementsByClassName('seal');
let main = document.getElementsByClassName('main');
let card_body = document.getElementsByClassName('card-body');
let card_body_main = document.getElementsByClassName('card-body-main');
let warn_text = document.getElementsByClassName('warn-text');
let pagings = document.getElementsByClassName('pagings');
let confirmes = document.getElementsByClassName('confirmes');
let warn_texts = document.getElementsByClassName('warn-texts');
let layer_click = document.getElementsByClassName('layer-click');
let layer_list = document.getElementsByClassName('layer-list');
let startTimes = document.getElementsByClassName('startTimes');
let warnings = document.getElementsByClassName('warnings');
let btn_delete = document.getElementsByClassName('btn-delete');
let card_list_checkbox = document.getElementsByClassName('card-list-checkbox');
let checkbox_all = document.getElementsByClassName('checkbox-all');
let checkbox = document.getElementsByClassName('checkbox');

let authentications = document.getElementsByClassName('authentications');




function authentication(){
    axios({
        method:'GET',
        url:'/superAdmin/showCertificationArea',
    }).then(result =>{
        // console.log(result.data.msg);
        let all = `<dd class="layer-select-tips layer-this authentications" value="">请选择</dd>`
        for(let i=0;i<result.data.msg.length;i++){
            all += `<dd class="layer-select-tips  authentications" value="">${result.data.msg[i].area_name}</dd>`
        }

        layer_list[1].innerHTML = all;
        let index = 0;
    for(let i=0;i<authentications.length;i++){
        authentications[i].numbers = i;
        authentications[i].onclick = function(){

            index = this.numbers;
            // renews(index);
            layer_list[1].style.display = 'none';
            authentication_flag = true;
            for(let i=0;i<authentications.length;i++){
                authentications[i].classList.remove('layer-this');
            }
            authentications[index].classList.add('layer-this');
            // let arr = startTimes[index].innerHTML.split('天');
            // console.log(arr);
            // if(arr == '请选择'){
            //     arr[0] = '';
            // }
            layer_click[1].value =authentications[index].innerHTML;
        }
    }
    })
}

authentication();


function renders(begin,size){
    axios({
        method:'GET',
        url:'/superAdmin/showWhitelisting',
        params:{
            beginIndex:begin,
            endIndex:size
        }
    }).then(result =>{
        // console.log(result.data.msg);
        let all = result.data.msg.list;
        let All = '';
        if(all.length == 0){
            all = `<li class="card-list-nothing">暂无最新内容</li>`
            card_body_main[0].innerHTML = all;
            generatePagination(1,0,1,0,renders,-1);
        }else{
            for(let i=0;i<all.length;i++){
                if(all[i].status == 1 && all[i].certification == null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-checkbox"><input type="checkbox" class="checkbox"></li>
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].name}</li>
                    <li class="card-list-sex">${all[i].sex}</li>
                    <li class="card-list-status">封号</li>
                    <li class="card-list-status">无认证</li>
                    <li class="card-list-mail">${all[i].mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/delete.png" alt="" class="forbid">
                            删除
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].status == 0 && all[i].certification != null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-checkbox"><input type="checkbox" class="checkbox"></li>
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].name}</li>
                    <li class="card-list-sex">${all[i].sex}</li>
                    <li class="card-list-status">正常</li>
                    <li class="card-list-status">${all[i].certification}</li>
                    <li class="card-list-mail">${all[i].mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/delete.png" alt="" class="forbid">
                            删除
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].status == 0 && all[i].certification == null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-checkbox"><input type="checkbox" class="checkbox"></li>
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].name}</li>
                    <li class="card-list-sex">${all[i].sex}</li>
                    <li class="card-list-status">正常</li>
                    <li class="card-list-status">无认证</li>
                    <li class="card-list-mail">${all[i].mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/delete.png" alt="" class="forbid">
                            删除
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].status == 1 && all[i].certification != null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-checkbox"><input type="checkbox" class="checkbox"></li>
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].name}</li>
                    <li class="card-list-sex">${all[i].sex}</li>
                    <li class="card-list-status">封号</li>
                    <li class="card-list-status">${all[i].certification}</li>
                    <li class="card-list-mail">${all[i].mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/delete.png" alt="" class="forbid">
                            删除
                        </button>
                    </li>
                </ul>
                `
                }
                
            }
            card_body_main[0].innerHTML = All;
            pagings[0].maxNumber = result.data.msg.all_page;
            pagings[0].all_size = result.data.msg.all_count;
            pagings[0].cur_index = result.data.msg.cur_index;
            pagings[0].size = result.data.msg.size;
            // console.log(pagings[0].maxNumber);
            generatePagination(pagings[0].maxNumber, size, begin,result.data.msg.all_count,renders);
            // console.log(manage_name[0].innerText);
            let names = manage_name[0].innerText.replace(/\s*/g,"");
            for(let j=0;j<all.length;j++){
                forbiding[j].ids = all[j].id;
                checkbox_all[0].numbers = 0;
                card_list_checkbox[j].ids = all[j].id;
                card_list_checkbox[j].names = all[j].name;
                checkbox[j].onclick = function(){
                    if(this.checked == true){
                        checkbox_all[0].numbers +=1;
                    }else{
                        checkbox_all[0].numbers -=1;
                    }
                    if(checkbox_all[0].numbers >= 1 ){
                        btn_delete[0].style.cursor =  'pointer';
                    }else if(checkbox_all[0].numbers == 0){
                        btn_delete[0].style.cursor =  'not-allowed';
                    }
                }
                forbiding[j].onclick = function(){
                    // confirms[1].numbers = 1;
                    // confirms[1].ids = all[j].user.id;
                    btn_delete[0].ids = all[j].id;
                    btn_delete[0].numbers = 1;
                    warn_text[0].innerHTML = '确定把用户名为：' + all[j].name + '从白名单删除嘛？'
                    hidden[1].style.display = 'block'
                }
            }
        }
        
    })
}
renders(1,5);


cancel[0].onclick  = function(){
    hidden[0].style.display = 'none';
}
cancel[1].onclick  = function(){
    hidden[1].style.display = 'none';
}
cancel[2].onclick  = function(){
    hiddens[0].style.display = 'none';
}

btn_delete[0].onclick = function(){
    btn_delete[0].numbers = 0;
    if(checkbox_all[0].numbers == 1){
        hidden[1].style.display = 'block';
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                warn_text[0].innerHTML = '确定删除角色名称为：' + card_list_checkbox[i].names + '嘛？' 
            }
        }
    }else if(checkbox_all[0].numbers >1){
        hidden[1].style.display = 'block';
        warn_text[0].innerHTML = '确定选中的这些都要删除嘛？'
    }
}


confirms[1].onclick = function(){
    if(btn_delete[0].numbers == 0){
        let index = 0;
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                index ++;
                axios({
                    method:'GET',
                    url:'/superAdmin/deleteWhitelisting',
                    params:{
                        userId:card_list_checkbox[i].ids
                    }
                }).then(result =>{
                    // console.log(result.data);
                    if(result.data.msg == 'success'){
                        hidden[1].style.display = 'none';
                        warn_texts[0].innerHTML = '删除成功'
                        warnings[0].src = 'public/iconfont/success.png'
                        hidden[2].style.display = 'block'
                        if(index == checkbox_all[0].numbers){
                            if(pagings[0].cur_index != 1){
                                if(checkbox.length ==  checkbox_all[0].numbers && pagings[0].maxNumber == pagings[0].cur_index ){
                                    renders(v[0].cur_index-1,pagings[0].size,-1);
                                }else{
                                    renders(pagings[0].cur_index,pagings[0].size,-1);
                                }
                            }else{
                                renders(pagings[0].cur_index,pagings[0].size,-1);
                            }
                            
                        }
                    }
                    
                })
            }
        }
        // console.log( checkbox_all[0].numbers);
    }else{
        axios({
            method:'GET',
            url:'/superAdmin/deleteWhitelisting',
            params:{
                userId:btn_delete[0].ids
            }
        }).then(result =>{
            // console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[1].style.display = 'none';
                warn_texts[0].innerHTML = '删除成功'
                warnings[0].src = 'public/iconfont/success.png'
                hidden[2].style.display = 'block'
                // console.log(pagings[0].all_size);
                // console.log(pagings[0].size);
                if(pagings[0].cur_index != 1){
                    if(pagings[0].all_size % pagings[0].size == 1 && pagings[0].maxLength == pagings[0].cur_index){
                        renders(pagings[0].cur_index-1,pagings[0].size,-1);
                    }else{
                        renders(pagings[0].cur_index,pagings[0].size,-1);
                    }
                }else{
                    renders(pagings[0].cur_index,pagings[0].size,-1);
                }
                
                
            }
        })
    }

    
}

confirmes[0].onclick = function(){
    hidden[2].style.display = 'none'
}


checkbox_all[0].onclick = function(){
    // console.log(checkbox_all[0].checked);
    if(checkbox_all[0].checked == true){
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                
            }else{
                checkbox[i].click();
            }
        }
    }else{
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                checkbox[i].click();
            }
        }
    }
}