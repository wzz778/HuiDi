// const { default: axios } = require("axios");


let hidden_input = document.getElementsByClassName('hidden-input');
let card_body = document.getElementsByClassName('card-body');
let btn_new = document.getElementsByClassName('btn-new');
let btn_update = document.getElementsByClassName('btn-update');
let btn_delete = document.getElementsByClassName('btn-delete');
let hidden = document.getElementsByClassName('hidden');
let confirms = document.getElementsByClassName('confirm');
let cancel = document.getElementsByClassName('cancel');
let card_list_checkbox = document.getElementsByClassName('card-list-checkbox');
let checkbox = document.getElementsByClassName('checkbox');
let checkbox_all = document.getElementsByClassName('checkbox-all');
let pop_up = document.getElementsByClassName('pop-up');
let pop_change = document.getElementsByClassName('pop-change');
let  warn_text = document.getElementsByClassName('warn-text');
let updates = document.getElementsByClassName('update');
let deletes = document.getElementsByClassName('delete');
let news = document.getElementsByClassName('new');


//渲染页面
function renders(){
    axios({
        method:'GET',
        url:'/superAdmin/showRole',
    }).then(result =>{
        console.log(result.data);
        let all =  result.data;
        let All = ''
        for(let i=0;i<all.msg.length;i++){
            let str = all.temps[i].join(",")
                All += `<ul class="card-body-list">
            <li class="card-list-checkbox"><input type="checkbox" class="checkbox"></li>
            <li class="card-list-number">${i+1}</li>
            <li class="card-list-name">${all.msg[i].role.role_name}</li>
            <li class="card-list-sex">${str}</li>
            <li class="card-list-status">${all.msg[i].role.id}</li>
            <li class="card-list-other">
                <button class="btn update">
                    修改
                </button>
                <button class="btn delete">
                    删除
                </button>
                <button class="btn new">
                    新增权限
                </button>
            </li>
        </ul>`
        }
        card_body[0].innerHTML += All;
        for(let j=0;j<all.msg.length;j++){
            checkbox_all[0].numbers = 0;
            card_list_checkbox[j].ids = all.msg[j].role.id;
            card_list_checkbox[j].names = all.msg[j].role.role_name;
            checkbox[j].onclick = function(){
                if(this.checked == true){
                    checkbox_all[0].numbers +=1;
                }else{
                    checkbox_all[0].numbers -=1;
                }
                if(checkbox_all[0].numbers == 0){
                    btn_update[0].style.cursor =  'not-allowed';
                    btn_delete[0].style.cursor =  'not-allowed';
                }else if(checkbox_all[0].numbers == 1){
                    btn_update[0].style.cursor =  'pointer';
                    btn_delete[0].style.cursor =  'pointer';
                }else if(checkbox_all[0].numbers > 1 ){
                    btn_update[0].style.cursor =  'not-allowed';
                    btn_delete[0].style.cursor =  'pointer';
                }
            }
            updates[j].onclick = function(){
                hidden[0].style.display = 'block';
                btn_new[0].numbers = 1;
                pop_change[0].innerHTML = all;
                pop_up[0].style.height = '300px';
                console.log(card_list_checkbox[j].names);
                axios({
                    method:'GET',
                    url:'/superAdmin/showByRoleName',
                    params:{
                        role_name: card_list_checkbox[j].names
                    }
                }).then(result =>{
                    console.log(result.data);
                    let all = `<div class="hint">
                            修改角色
                            </div>
                            <div class="pop-main">
                                角色名称：
                                <input type="text" class="hidden-input">
                            </div>
                            <div class="pop-main">
                                权限字符：
                                <select name="" id="" class="hidden-input">

                                </select>
                            </div>
                            <div class="pop-main">
                                修改字符：
                                <input type="text" class="hidden-input">
                            </div>`
                            pop_change[0].innerHTML = all;
                            hidden_input[0].value = result.data.msg.role.role_name;
                            hidden_input[0].ids = result.data.msg.role.id;
                            let All = '';
                            for(let i=0;i<result.data.msg.list.length;i++){
                                All += `<option value="${result.data.msg.list[i].id}">${result.data.msg.list[i].permiss_name}</option>`
                            }
                            hidden_input[1].innerHTML = All;
                        
                })
            }
            deletes[j].onclick = function(){
                btn_delete[0].numbers = 1;
                btn_delete[0].name = card_list_checkbox[j].names;
                btn_delete[0].ids = all.msg[j].role.id;
                hidden[1].style.display = 'block';
                warn_text[0].innerHTML = '确定删除角色名称为：' + card_list_checkbox[j].names + '嘛？'
            }
            news[j].onclick = function(){
                checkbox_all[0].r_ids = card_list_checkbox[j].ids;
                hidden[0].style.display = 'block';
                pop_up[0].style.height = '250px';
                btn_new[0].numbers = 2;
                let all = `<div class="hint">
                            为角色添加权限
                            </div>
                            <div class="pop-main">
                                角色名称：
                                <input type="text" class="hidden-input" value="${card_list_checkbox[j].names}" disabled =“disabled”>
                            </div>
                            <div class="pop-main">
                                权限字符：
                                <input type="text" class="hidden-input">
                            </div>`
                            pop_change[0].innerHTML = all;
            }
        }
    })
}

renders();

//新增
btn_new[0].onclick = function(){
    hidden[0].style.display = 'block';
    btn_new[0].numbers = 0;
    pop_up[0].style.height = '250px';
    let all = `<div class="hint">
                添加角色
                </div>
                <div class="pop-main">
                    角色名称：
                    <input type="text" class="hidden-input">
                </div>
                <div class="pop-main">
                    权限字符：
                    <input type="text" class="hidden-input">
                </div>`
                pop_change[0].innerHTML = all;
}
//修改
btn_update[0].onclick = function(){
    if(checkbox_all[0].numbers == 1){
        hidden[0].style.display = 'block';
        btn_new[0].numbers = 1;
        pop_up[0].style.height = '300px';
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                console.log(card_list_checkbox[i].names);
                axios({
                    method:'GET',
                    url:'/superAdmin/showByRoleName',
                    params:{
                        role_name: card_list_checkbox[i].names
                    }
                }).then(result =>{
                    console.log(result.data);
                    let all = `<div class="hint">
                            修改角色
                            </div>
                            <div class="pop-main">
                                角色名称：
                                <input type="text" class="hidden-input">
                            </div>
                            <div class="pop-main">
                                权限字符：
                                <select name="" id="" class="hidden-input">

                                </select>
                            </div>
                            <div class="pop-main">
                                修改字符：
                                <input type="text" class="hidden-input">
                            </div>`
                            pop_change[0].innerHTML = all;
                            hidden_input[0].value = result.data.msg.role.role_name;
                            hidden_input[0].ids = result.data.msg.role.id;
                            let All = '';
                            for(let i=0;i<result.data.msg.list.length;i++){
                                All += `<option value="${result.data.msg.list[i].id}">${result.data.msg.list[i].permiss_name}</option>`
                            }
                            hidden_input[1].innerHTML = All;
                        
                })
            }
        }
    }else{

    }
}
btn_delete[0].onclick = function(){
    btn_delete[0].numbers = 0;
    if(checkbox_all[0].numbers == 1){
        hidden[1].style.display = 'block';
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                warn_text[0].innerHTML = '确定删除角色名称为：' + card_list_checkbox[j].names + '嘛？' 
            }
        }
    }else if(checkbox_all[0].numbers >1){
        hidden[1].style.display = 'block';
        warn_text[0].innerHTML = '确定选中的这些都要删除嘛？'
    }
}


//确认
confirms[0].onclick = function(){
    if(btn_new[0].numbers == 0){
        let arr = new Array(hidden_input[1].value.split(','))
        axios({
            method:'POST',
            url:'/superAdmin/manageRole',
            data:{
                list:arr,
                role:hidden_input[0].value,
            }
        }).then((result)=>{
            console.log(result);
        })
    }else if(btn_new[0].numbers == 1){
        console.log(hidden_input[0].ids);
        console.log(hidden_input[0].value);
        axios({
            method:'GET',
            url:'/superAdmin/updateRole',
            params:{
                id:hidden_input[0].ids,
                role_name:hidden_input[0].value,
            }
        }).then(result =>{
            console.log(result.data);
            axios({
                method:'GET',
                url:'/superAdmin/updateRolePermiss',
                params:{
                    id:hidden_input[1].options[hidden_input[1].selectedIndex].value,
                    permiss_name:hidden_input[2].value,
                    r_id:hidden_input[0].ids
                }
            }).then(result =>{
                console.log(result.data);
                renders();
            })
        })
    }else if(btn_new[0].numbers == 2){
        axios({
            method:'GET',
            url:'/superAdmin/addRolePermission',
            params:{
                permiss_name:hidden_input[1].value,
                r_id:checkbox_all[0].r_ids
            }
        }).then(result =>{
            console.log(result.data);
            renders();
        })
    }
    hidden[0].style.display = 'none';
}
//取消
cancel[0].onclick = function(){
    hidden[0].style.display = 'none';
}

//确认
confirms[1].onclick = function(){
    if(btn_delete[0].numbers == 0){
        for(let i=0;i<checkbox.length;i++){
            if(checkbox[i].checked == true){
                axios({
                    method:'GET',
                    url:'/superAdmin/deleteRole',
                    params:{
                        id:card_list_checkbox[j].ids
                    }
                }).then(result =>{
                    console.log(result.data);
                    renders();
                })
            }
        }
    }else {
        axios({
            method:'GET',
            url:'/superAdmin/deleteRole',
            params:{
                id:btn_delete[0].ids
            }
        }).then(result =>{
            console.log(result.data);
            renders();
        })
    }
    hidden[1].style.display = 'none';
}
//取消
cancel[1].onclick = function(){
    hidden[1].style.display = 'none';
}