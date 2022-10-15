let detail = document.getElementsByClassName('detail');
let card_body_main = document.getElementsByClassName('card-body-main');
let pageings = document.getElementsByClassName('pageings');
let card_body_list = document.getElementsByClassName('card-body-list');
let bans = document.getElementsByClassName('bans');
let forbiding = document.getElementsByClassName('forbiding');
let confirms = document.getElementsByClassName('confirm');
let hidden = document.getElementsByClassName('hidden')

let confirmes = document.getElementsByClassName('confirmes');
let warn_texts = document.getElementsByClassName('warn-texts');
let warnings = document.getElementsByClassName('warnings');



let layer_this = document.getElementsByClassName('layer-this');
let layer_click = document.getElementsByClassName('layer-click');
let layer_list = document.getElementsByClassName('layer-list');
let startTimes = document.getElementsByClassName('startTimes');

let flag = true;
let flag1 = true;
let warn_text = document.getElementsByClassName('warn-text');


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
                <li class="card-list-status">举报内容</li>
                <li class="card-list-other">其他操作</li>`
                if(result.data.msg.list[i].ob.user.status == 0){
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
                                    受理
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
                                    受理
                                </button>
                            </li>
                        </ul>`
                    }
                }else{
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
                                    已封号
                                </button>
                                <button class="btn detail">
                                    <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                    受理
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
                                    已封号
                                </button>
                                <button class="btn detail">
                                    <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                    受理
                                </button>
                            </li>
                        </ul>`
                    }
                }
                
                
                

            }else{
                card_body_list[0].innerHTML = `<li class="card-list-number">序号</li>
                <li class="card-list-name">举报人</li>
                <li class="card-list-sex">性别</li>
                <li class="card-list-mail">邮箱</li>
                <li class="card-list-status">举报理由</li>
                <li class="card-list-other">其他操作</li>`
                if(result.data.msg.list[i].ob.user.status == 0){
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
                }else{
                    all += `<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.user.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].ob.user.sex}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].ob.user.mail}</li>
                        <li class="card-list-status">${result.data.msg.list[i].message}</li>
                        <li class="card-list-other">
                            <button class="btn forbiding">
                                <img src="public/iconfont/forbid.png" alt="" class="forbid">
                                已封号
                            </button>
                            <button class="btn detail">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
                        </li>
                    </ul>`
                }
                
            }
            
        }
        card_body_main[0].innerHTML = all;
        generatePagination(result.data.msg.all_page,result.data.msg.size,result.data.msg.cur_index,result.data.msg.all_count,renders,numbers);
        // renderPaging(renders,page_current[0].maxLength,page_current[0].all_size,-1)
        for(let i=0;i<result.data.msg.list.length;i++){
            if(result.data.msg.list[i].types == 1){
                detail[i].onclick = function(){
                    confirms[1].ids = result.data.msg.list[i].id;
                    warn_text[0].innerHTML = '确定受理该举报嘛？'
                    hidden[1].style.display = 'block';
                }
            }else{
                detail[i].onclick = function(){
                    window.location.href = '/superDynamicDetails?id=' + result.data.msg.list[i].report_id
                }
            }
            forbiding[i].onclick = function(){
                confirms[0].ids = 
                hidden[0].style.display = 'block'
            }
        }
    })
}
renders(1,5,1)



// 下拉框的效果

layer_click[0].onclick = function(){
    if(flag == true){
        layer_list[0].style.display = 'block';
        flag = false;
    }else{
        layer_list[0].style.display = 'none';
        flag = true;
    }
}
layer_click[1].onclick = function(){
    if(flag1 == true){
        layer_list[1].style.display = 'block';
        flag1 = false;
    }else{
        layer_list[1].style.display = 'none';
        flag1 = true;
    }
}
function ds(){
    let index = 0;
    for(let i=0;i<startTimes.length;i++){
        startTimes[i].numbers = i;
        startTimes[i].onclick = function(){

            index = this.numbers;
            renew(index);
            layer_list[1].style.display = 'none';
            flag1 = true;
            let news = startTimes[index].innerHTML;
            if(news == '评论举报'){
                renders(pageings[0].cur_index,pageings[0].size,1);
            }else{
                renders(pageings[0].cur_index,pageings[0].size,0);
            }
            layer_click[1].value =startTimes[index].innerHTML;
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
function des(){
    let index = 0;
    for(let i=0;i<bans.length;i++){
        bans[i].numbers = i;
        bans[i].onclick = function(){
            console.log(1);
            index = this.numbers;
            renews(index);
            layer_list[0].style.display = 'none';
            flag = true;
            let news = bans[index].innerHTML;
            layer_click[0].value =bans[index].innerHTML;
        }
    }
}
function renews(index){
    for(let i=0;i<bans.length;i++){
        bans[i].classList.remove('layer-this');
    }
    bans[index].classList.add('layer-this');
}
des();


confirms[0].onclick = function(){
    let arr = layer_click[0].value.split('天');
    console.log(arr);
    if(arr == '请选择'){
        arr[0] = '';
    }
    
    if(arr[0] != ''){
        let timing = getEndDate(arr[0]);
        console.log(timing);
        axios({
            method:'GET',
            url:'/superAdmin/updateUserStatus',
            params:{
                end_time:timing,
                id:confirms[0].ids,
                status:1,
            }
        }).then(result =>{
            console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[0].style.display = 'none';
                warnings[0].src = 'public/iconfont/success.png'
                warn_texts[0].innerHTML = '封号成功'
                hidden[2].style.display = 'block';
                if(layer_this[1].innerHTML == '评论举报'){
                    renders(pageings[0].cur_index,pageings[0].size,1);
                }else{
                    renders(pageings[0].cur_index,pageings[0].size,0);
                }
            }
            
        })
    }
    console.log(arr[0]);
}


confirms[1].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/updateReportStatus',
        params:{
            id:confirms[1].ids,
            status:1
        }
    }).then(result =>{
        console.log(result.data);
        if(result.data.msg == 'success'){
            hidden[1].style.display = 'none';
            hidden[2].style.display = 'block';
            warnings[0].src = 'public/iconfont/success.png'
            warn_texts[0].innerHTML = '受理成功'
            renders(pageings[0].cur_index,pageings[0].size,1);
        }
    })
}


confirmes[0].onclick = function(){
    hidden[2].style.display = 'none';
}










function getNowTime(num){
    let date = new Date(num);
    var year = date.getFullYear();
    var month = date.getMonth() +1;
    var data = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds(); 
    data = data > 9 ? data : "0" + data;
    month = month >9 ? month : "0" + month;
    hour = hour >9 ? hour : "0" + hour;
    minute = minute >9 ? minute : "0" + minute;
    second = second >9 ? second : "0" + second;
    let timing = year + '-' + month  + '-' + data  + " " + hour  + ':' + minute  + ':' + second;
    return timing;
}




function getEndDate(num){
	var day=num;//获取相隔天数 //将日期时间转换为毫秒值
	var newTimes = Date.now() + 3600000*24*(day); //(day)天后的毫秒值，3600 000 为1小时的毫秒值
    return getNowTime(newTimes);
}