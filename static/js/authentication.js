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
let pop_main = document.getElementsByClassName('pop-main');
let classify_list_next = document.getElementsByClassName('classify-list-next');
let confirm = document.getElementsByClassName('confirm');
let cancel = document.getElementsByClassName('cancel');
let warn_text = document.getElementsByClassName('warn-text');
let secondLevel = document.getElementsByClassName('secondLevel');
let update = document.getElementsByClassName('update');
let deletes = document.getElementsByClassName('delete');
let confirmes = document.getElementsByClassName('confirmes');
let warn_texts = document.getElementsByClassName('warn-texts');
let warnings = document.getElementsByClassName('warnings');
// console.log(arrow.length);


//input输入判断
classifier_list[0].oninput = function(){
    this.value = this.value.replace(/\s*/g,"");
}

btn_new[0].onclick = function(){
    classifier_list[0].value = '';
    hidden[0].style.display = 'block';
    btn_new[0].numbers = 0;
}


// 新增认证范围，修改
btn_confirm[0].onclick = function(){
    console.log(classifier_list[0].value);
    if(btn_new[0].numbers == 0){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/addCertificationInfo',
                params:{
                    area_name:classifier_list[0].value,
                }
            }).then(result =>{
                // console.log(result.data);
                if(result.data.msg == 'success'){
                    hidden[0].style.display = 'none';
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '添加成功'
                    warnings[0].src = 'public/iconfont/success.png'
                    
                    renders();
                }else if(result.data.msg == null){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '认证范围重复，请重新输入一个新的认证氛围'
                    warnings[0].src = 'public/iconfont/warn2.png'
                    
                }
                
            })
        }
    }else if(btn_new[0].numbers == 2){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/updateCertificationArea',
                params:{
                    id:btn_update[0].ids,
                    area_name:classifier_list[0].value
                }
            }).then(result =>{
                // console.log(result.data);
                if(result.data.msg == 'success'){
                    hidden[0].style.display = 'none';
                    warn_texts[0].innerHTML = '修改成功'
                    warnings[0].src = 'public/iconfont/success.png'
                    hidden[2].style.display = 'block'
                    renders();
                }else if(result.data.msg == '插入重复数据'){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '认证范围重复，请重新输入一个新的认证氛围'
                    warnings[0].src = 'public/iconfont/warn2.png'
                }
            })
        }
    }
}

// 关闭弹框
btn_cancel[0].onclick = function(){
    hidden[0].style.display = 'none';
}


// 渲染页面
function renders(){
    axios({
        method:'GET',
        url:'/superAdmin/showCertificationArea',
    }).then(result =>{
        // console.log(result.data);
        let all = '';
        for(let i=0;i<result.data.msg.length;i++){
            all +=`<div class="classify-list">
                        <span class="classify-name">${result.data.msg[i].area_name}</span>
                        <div class="func">
                            <button class="btn btn-update">修改</button>
                            <button class="btn btn-delete">删除</button>
                        </div>
                    </div>`
        }
        classifies[0].innerHTML =  all;
        let All = ''
        for(let j=0;j<result.data.msg.length;j++){
            btn_update[j].onclick = function(){
                btn_new[0].numbers = 2;
                btn_update[0].ids = result.data.msg[j].id
                pop_main[0].innerHTML = `<div class="hint">
                                            修改认证
                                        </div>
                                        <div class="classifier">
                                            <span class="'classifier-title">认证名称：</span>
                                            <input type="text" class="classifier-input" placeholder="请输入新的认证名称">
                                        </div>`
                                        classifier_list[0].value = result.data.msg[j].area_name
                                        hidden[0].style.display = 'block';
                                        classifier_list[0].oninput = function(){
                                            this.value = this.value.replace(/\s*/g,"");
                                        }
            }
            btn_delete[j].onclick = function(){
                btn_update[0].ids = result.data.msg[j].id;
                warn_text[0].innerHTML = '确定删除认证名称为：' + result.data.msg[j].area_name + '嘛？'
                hidden[1].style.display = 'block';
            }
        }
    })
}
renders();



confirm[0].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/deleteCertificationArea',
        params:{
            ids:btn_update[0].ids
        }
    }).then(result =>{
        // console.log(result.data);
        if(result.data.msg == 'success'){
            hidden[1].style.display = 'none'
            warn_texts[0].innerHTML = '删除成功'
            warnings[0].src = 'public/iconfont/success.png'
            hidden[2].style.display = 'block'
            renders();
        }
    })
}
cancel[0].onclick = function(){
    hidden[1].style.display = 'none'
}


confirmes[0].onclick = function(){
    hidden[2].style.display = 'none'
}