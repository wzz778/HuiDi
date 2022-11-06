


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
        url:'/superAdmin/showSuspicious',
        params:{
            beginIndex:begin,
            endIndex:size
        }
    }).then(result =>{
        console.log(result.data.msg);
        let all = result.data.msg.list;
        let All = '';
        if(all.length == 0){
            all = `<li class="card-list-nothing">暂无最新内容</li>`
            card_body_main[0].innerHTML = all;
            generatePagination(1,0,1,0,renders,-1);
        }else{
            for(let i=0;i<all.length;i++){
                if(all[i].user.status == 1 && all[i].user.certification == null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].user.name}</li>
                    <li class="card-list-sex">${all[i].user.sex}</li>
                    <li class="card-list-status">封号</li>
                    <li class="card-list-status">无认证</li>
                    <li class="card-list-time">${all[i].count}</li>
                    <li class="card-list-mail">${all[i].user.mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/warn.png" alt="" class="forbid">
                             添加
                        </button>
                        <button class="btn seal">
                            <img src="public/iconfont/forbid.png" alt="" class="forbid">
                            已封号
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].user.status == 0 && all[i].user.certification != null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].user.name}</li>
                    <li class="card-list-sex">${all[i].user.sex}</li>
                    <li class="card-list-status">正常</li>
                    <li class="card-list-status">${all[i].user.certification}</li>
                    <li class="card-list-time">${all[i].count}</li>
                    <li class="card-list-mail">${all[i].user.mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/warn.png" alt="" class="forbid">
                            添加
                        </button>
                        <button class="btn seal">
                            <img src="public/iconfont/forbid.png" alt="" class="forbid">
                            封号
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].user.status == 0 && all[i].user.certification == null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].user.name}</li>
                    <li class="card-list-sex">${all[i].user.sex}</li>
                    <li class="card-list-status">正常</li>
                    <li class="card-list-status">无认证</li>
                    <li class="card-list-time">${all[i].count}</li>
                    <li class="card-list-mail">${all[i].user.mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/warn.png" alt="" class="forbid">
                            添加
                        </button>
                        <button class="btn seal">
                            <img src="public/iconfont/forbid.png" alt="" class="forbid">
                            封号
                        </button>
                    </li>
                </ul>
                `
                }else if(all[i].user.status == 1 && all[i].user.certification != null){
                    All += `
                <ul class="card-body-list">
                    <li class="card-list-number">${i+1}</li>
                    <li class="card-list-name">${all[i].user.name}</li>
                    <li class="card-list-sex">${all[i].user.sex}</li>
                    <li class="card-list-status">封号</li>
                    <li class="card-list-status">${all[i].user.certification}</li>
                    <li class="card-list-time">${all[i].count}</li>
                    <li class="card-list-mail">${all[i].user.mail}</li>
                    <li class="card-list-other">
                        <button class="btn forbiding">
                            <img src="public/iconfont/warn.png" alt="" class="forbid">
                            添加
                        </button>
                        <button class="btn seal">
                            <img src="public/iconfont/forbid.png" alt="" class="forbid">
                            已封号
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
            generatePagination(pagings[0].maxNumber, size, begin,result.data.msg.all_count,renders,-1);
            // console.log(manage_name[0].innerText);
            let names = manage_name[0].innerText.replace(/\s*/g,"");
            for(let j=0;j<all.length;j++){
                seal[j].ids = all[j].user.id;
                if(result.data.msg.list[j].user.status == 1){
                    // if(manage_name = all[j].name)
                    seal[j].onclick = function(){
                        confirms[1].numbers = 0;
                        confirms[1].ids = all[j].user.id;
                        warn_text[0].innerHTML = '确定解除用户名为：' + all[j].user.name + '的封号嘛？'
                        hidden[1].style.display = 'block'
                    }
                }else{
                    seal[j].onclick = function(){
                        // console.log(all[j].name.length);
                        // console.log(names.replace(/\s*/g,"").length);
                        // console.log(all[j].name);
                        // console.log(names.replace(/\s*/g,""));
                        // alert(names==all[j].name)
                        if( names == all[j].name){
                            // console.log(1);
                            warnings[0].src = 'public/iconfont/warn2.png'
                            warn_texts[0].innerHTML = '不能对自己进行封号'
                            hidden[2].style.display = 'block';
                        }else{
                            // console.log(1);
                            startTimes[0].click();
                            confirms[0].ids  = all[j].id;
                            hidden[0].style.display = 'block';
                        }
                        
                    }
                }
                forbiding[j].onclick = function(){
                    confirms[1].numbers = 1;
                    confirms[1].ids = all[j].user.id;
                    warn_text[0].innerHTML = '确定把用户名为：' + all[j].user.name + '添加到白名单嘛？'
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


confirms[0].onclick  = function(){
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
            // console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[0].style.display = 'none';
                warnings[0].src = 'public/iconfont/success.png'
                warn_texts[0].innerHTML = '封号成功'
                hidden[2].style.display = 'block';
            }
            renders(pagings[0].cur_index,pagings[0].size,-1)
        })
    }
    console.log(arr[0]);
}


confirms[1].onclick = function(){
    if(confirms[1].numbers == 0){
        let timing = getEndDate(0);
        axios({
            method:'GET',
                url:'/superAdmin/updateUserStatus',
                params:{
                    end_time:timing,
                    id:confirms[1].ids,
                    status:0,
                }
        }).then(result =>{
            // console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[1].style.display = 'none';
                warnings[0].src = 'public/iconfont/success.png'
                warn_texts[0].innerHTML = '封号解除'
                hidden[2].style.display = 'block';
            }
            renders(pagings[0].cur_index,pagings[0].size,-1)
        })
    }else if(confirms[1].numbers == 1){
        console.log(confirms[1].ids);
        axios({
            method:'GET',
                url:'/superAdmin/addWhitelisting',
                params:{
                    userId:confirms[1].ids
                }
        }).then(result =>{
            console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[1].style.display = 'none';
                warnings[0].src = 'public/iconfont/success.png'
                warn_texts[0].innerHTML = '添加成功'
                hidden[2].style.display = 'block';
            }
            renders(pagings[0].cur_index,pagings[0].size,-1)
        })
    }
    
}


confirms[2].onclick = function(){
    // let timing = getEndDate(0);
    let area_name = layer_click[1].value + '达人'
    console.log(area_name);
    axios({
        method:'GET',
            url:'/superAdmin/certificationUser',
            params:{
                certification:area_name,
                id:confirms[2].ids
            }
    }).then(result =>{
        // console.log(result.data);
        hiddens[0].style.display = 'none';
        renders(pagings[0].cur_index,pagings[0].size,-1)
    })
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


// 下拉框的效果

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

let authentication_flag = true;
layer_click[1].onclick = function(){
    if(authentication_flag == true){
        layer_list[1].style.display = 'block';
        authentication_flag = false;
    }else{
        layer_list[1].style.display = 'none';
        authentication_flag = true;
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
            let arr = startTimes[index].innerHTML.split('天');
            console.log(arr);
            if(arr == '请选择'){
                arr[0] = '';
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

function renews(index){
    for(let i=0;i<authentications.length;i++){
        authentications[i].classList.remove('layer-this');
    }
    authentications[index].classList.add('layer-this');
}
ds();


confirmes[0].onclick = function(){
    hidden[2].style.display = 'none'
}