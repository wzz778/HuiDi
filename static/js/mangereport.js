let detail = document.getElementsByClassName('detail');
let card_body_main = document.getElementsByClassName('card-body-main');
let pageings = document.getElementsByClassName('pageings');
let card_body_list = document.getElementsByClassName('card-body-list');

function renders(begin_index,size,numbers){
    axios({
        method:'GET',
        url:'/superAdmin/acceptReport',
        params:{
            begin_index:begin_index,
            size:size,
            type:numbers
        }
    }).then(result =>{
        console.log(result.data);
        pageings[0].maxLength = result.data.msg.all_page;
        pageings[0].all_size = result.data.msg.all_count
        pageings[0].cur_index = result.data.msg.cur_index
        pageings[0].size = result.data.msg.size
        let all = '';
        for(let i=0;i<result.data.msg.list.length;i++){
            if(result.data.msg.list[i].types == 1){
                
                card_body_list[0].innerHTML = `<li class="card-list-number">序号</li>
                <li class="card-list-name">举报人</li>
                <li class="card-list-sex">性别</li>
                <li class="card-list-mail">邮箱</li>
                <li class="card-list-status">举报理由</li>
                <li class="card-list-status">举报理由</li>
                <li class="card-list-other">其他操作</li>`
                if(result.data.msg.list[i].ob.comment == null){
                    let comment = '该评论已被删除'
                    all += `<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.user.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].ob.user.sex}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].ob.user.mail}</li>
                        <li class="card-list-status">${result.data.msg.list[i].message}</li>
                        <li class="card-list-status">${comment}</li>
                        <li class="card-list-other">
                            <button class="btn forbiding">
                                <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                封号
                            </button>
                            <button class="btn detail">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
                        </li>
                    </ul>`
                }else{
                    all += `<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.user.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].ob.user.sex}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].ob.user.mail}</li>
                        <li class="card-list-status">${result.data.msg.list[i].message}</li>
                        <li class="card-list-status">${result.data.msg.list[i].ob.comment.content}</li>
                        <li class="card-list-other">
                            <button class="btn forbiding">
                                <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                封号
                            </button>
                            <button class="btn detail">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
                        </li>
                    </ul>`
                }
                

            }else{
                card_body_list[0].innerHTML = `<li class="card-list-number">序号</li>
                <li class="card-list-name">举报人</li>
                <li class="card-list-sex">性别</li>
                <li class="card-list-mail">邮箱</li>
                <li class="card-list-status">举报理由</li>
                <li class="card-list-other">其他操作</li>`
                all += `<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.user.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].ob.user.sex}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].ob.user.mail}</li>
                        <li class="card-list-status">${result.data.msg.list[i].message}</li>
                        <li class="card-list-other">
                            <button class="btn forbiding">
                                <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                封号
                            </button>
                            <button class="btn detail">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
                        </li>
                    </ul>`
            }
            
        }
        card_body_main[0].innerHTML = all;
        generatePagination(result.data.msg.all_page,result.data.msg.size,result.data.msg.cur_index,result.data.msg.all_count,renders,numbers);
        // renderPaging(renders,page_current[0].maxLength,page_current[0].all_size,-1)
        for(let i=0;i<result.dat.msg.list.length;i++){
            if(result.data.msg.list[i].types == 1){

            }else{
                detail[i].onclick = function(){
                    window.location.href = '/superDynamicDetails?id=' + result.data.msg.list[i].report_id
                }
            }
        }
    })
}
renders(1,5,1)



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
            if(news == '评论举报'){
                renders(pageings[0].cur_index,pageings[0].size,1);
            }else{
                renders(pageings[0].cur_index,pageings[0].size,0);
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