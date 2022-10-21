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

//新增第一级分类
btn_new[0].onclick = function(){
    classifier_list[0].value = '';
    hidden[0].style.display = 'block';
    btn_new[0].numbers = 0;
}
   

// 新增第一级分类，修改，新增第二级分类
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
                // console.log(result.data);
                if(result.data.msg == 'success'){
                    hidden[0].style.display = 'none';
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '添加成功'
                    warnings[0].src = 'public/iconfont/success.png'
                    renders();
                    classifier_list[0].value = ''
                }else if(result.data.msg == null){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '类型名称重复，请重新命名'
                    warnings[0].src = 'public/iconfont/warn2.png'
                }
            })
        }else{
            hidden[2].style.display = 'block'
            warn_texts[0].innerHTML = '请把信息填写完整'
            warnings[0].src = 'public/iconfont/warn2.png'
        }
    }else if(btn_new[0].numbers == 1){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/addTypess',
                params:{
                    name:classifier_list[0].value,
                    level:2,
                    super_id:btn_new[0].super_id
                }
            }).then(result =>{
                // console.log(result.data);
                if(result.data.msg == 'success'){
                    hidden[0].style.display = 'none';
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '添加成功'
                    warnings[0].src = 'public/iconfont/success.png'
                    renders();
                    classifier_list[0].value = ''
                }else if(result.data.msg == null){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '类型名称重复，请重新命名'
                    warnings[0].src = 'public/iconfont/warn2.png'
                }
            })
        }else{
            hidden[2].style.display = 'block'
        warn_texts[0].innerHTML = '请把信息填写完整'
        warnings[0].src = 'public/iconfont/warn2.png'
        }
    }else if(btn_new[0].numbers == 2){
        if(classifier_list[0].value != ''){
            axios({
                method:'GET',
                url:'/superAdmin/updateType',
                params:{
                    id:btn_new[0].ids,
                    name:classifier_list[0].value
                }
            }).then(result =>{
                // console.log(result.data);
                if(result.data.msg == 'success'){
                    hidden[0].style.display = 'none';
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '添加成功'
                    warnings[0].src = 'public/iconfont/success.png'
                    renders();
                    classifier_list[0].value = ''
                }else if(result.data.msg == '插入重复数据'){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '类型名称重复，请重新命名'
                    warnings[0].src = 'public/iconfont/warn2.png'
                } 
            })
        }else{
            hidden[2].style.display = 'block'
            warn_texts[0].innerHTML = '请把信息填写完整'
            warnings[0].src = 'public/iconfont/warn2.png'
        }
    }
}

// 关闭弹框
btn_cancel[0].onclick = function(){
    hidden[0].style.display = 'none';
    classifier_list[0].value = ''
}


// 渲染页面
function renders(){
    axios({
        method:'GET',
        url:'/superAdmin/showAllType',
    }).then(result =>{
        // console.log(result.data);
        let all = '';
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
            all +=`<div class="secondLevel">

                    </div>`
            
        
        }
        classifies[0].innerHTML =  all;
        let All = ''
        for(let z =0;z<result.data.msg.length;z++){
            if(result.data.temps[z].length == 0){
                secondLevel[z].classList.add('nothinges');
                // console.log(1);
                // All += `<div class="second-level">
                            
                //         </div>`
                //         secondLevel[z].innerHTML = All;
            }else{
                for(let x=0;x<result.data.temps[z].length;x++){
                    All +=`<div class="second-level">
                            <div class="classify-list-next">
                                <span class="classify-next-name">${result.data.temps[z][x].name}</span>
                                <div class="func">
                                    <button class="btn update">修改</button>
                                    <button class="btn delete">删除</button>
                                </div>
                            </div>
                        </div>`
                }
                secondLevel[z].innerHTML = All;
                for(let i=0;i<result.data.temps[z].length;i++){
                    update[i].onclick = function(){
                        btn_new[0].numbers = 2;
                        btn_new[0].ids = result.data.temps[z][i].id;
                        pop_main[0].innerHTML = `<div class="hint">
                                                    修改分类
                                                </div>
                                                <div class="classifier">
                                                    <span class="'classifier-title">类别名称：</span>
                                                    <input type="text" class="classifier-input" placeholder="请输入新的类别名称">
                                                </div>`
                                                classifier_list[0].value = result.data.temps[z][i].name
                                                hidden[0].style.display = 'block';
                                                classifier_list[0].oninput = function(){
                                                    this.value = this.value.replace(/\s*/g,"");
                                                }
                        
                        // console.log(btn_new[0].ids);
                    }
                    deletes[i].onclick = function(){
                        btn_new[0].ids = result.data.temps[z][i].id;
                        console.log(btn_new[0].ids);
                        warn_text[0].innerHTML = '确定删除分类名称为：' + result.data.temps[z][i].name + '嘛？'
                        hidden[1].style.display = 'block';
                    }
                }
            }
        }
        for(let j=0;j<result.data.msg.length;j++){
            arrow_right[j].flag = true;
            // console.log([j].hasChildNodes());
            if(secondLevel[j].classList.contains('nothinges')){
                arrow_right[j].onclick = function(){
                    hidden[2].style.display = 'block'
                    warn_texts[0].innerHTML = '没有下一级内容'
                    warnings[0].src = 'public/iconfont/warn2.png'
                }
            }else{
                arrow_right[j].onclick = function(){
                    // console.log(flag);
                    if(this.flag == true){
                        let angle = 90;
                        arrow_right[j].style.transform = "rotate("+angle +"deg)";
                        secondLevel[j].style.display = 'block'
                        this.flag = false;
                    }else{
                        arrow_right[j].style.transform = 'rotate(0)';
                        secondLevel[j].style.display = 'none';
                        this.flag = true;
                    }
                }
            }
            
            news[j].onclick = function(){
                classifier_list[0].value = '';
                btn_new[0].numbers = 1;
                btn_new[0].super_id = result.data.msg[j].type.id;
                hidden[0].style.display = 'block'
            }
            btn_update[j].onclick = function(){
                btn_new[0].numbers = 2;
                btn_new[0].ids = result.data.msg[j].type.id;
                pop_main[0].innerHTML = `<div class="hint">
                                            修改分类
                                        </div>
                                        <div class="classifier">
                                            <span class="'classifier-title">类别名称：</span>
                                            <input type="text" class="classifier-input" placeholder="请输入新的类别名称">
                                        </div>`
                                        classifier_list[0].value = result.data.msg[j].type.name
                                        hidden[0].style.display = 'block';
                                        classifier_list[0].oninput = function(){
                                            this.value = this.value.replace(/\s*/g,"");
                                        }
            }
            btn_delete[j].onclick = function(){
                btn_new[0].ids = result.data.msg[j].type.id;
                warn_text[0].innerHTML = '确定删除分类名称为：' + result.data.msg[j].type.name + '嘛？'
                hidden[1].style.display = 'block';
            }
        }
    })
}
renders();



confirm[0].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/deleteType',
        params:{
            id:btn_new[0].ids
        }
    }).then(result =>{
        // console.log(result.data);
        if(result.data.msg == 'success'){
            hidden[1].style.display = 'none';
            hidden[2].style.display = 'block'
            warn_texts[0].innerHTML = '删除成功'
            warnings[0].src = 'public/iconfont/success.png'
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