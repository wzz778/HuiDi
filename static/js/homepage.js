


let forbiding = document.getElementsByClassName('forbiding');
let cancel = document.getElementsByClassName('cancel');
let confirms  = document.getElementsByClassName('confirm')
let hidden = document.getElementsByClassName('hidden');
let seal = document.getElementsByClassName('seal');
let main = document.getElementsByClassName('main');
let card_body = document.getElementsByClassName('card-body');
let card_body_main = document.getElementsByClassName('card-body-main');
let warn_text = document.getElementsByClassName('warn-text');



function renders(begin,size){
    axios({
        method:'GET',
        url:'/superAdmin/showAllUser',
        params:{
            begin:begin,
            size:size
        }
    }).then(result =>{
        console.log(result.data.msg);
        let all = result.data.msg.records;
        let All = '';
        for(let i=0;i<all.length;i++){
            if(all[i].status == 1){
                All += `
            <ul class="card-body-list">
                <li class="card-list-number">${i}</li>
                <li class="card-list-name">${all[i].name}</li>
                <li class="card-list-sex">${all[i].sex}</li>
                <li class="card-list-status">封号</li>
                <li class="card-list-mail">${all[i].mail}</li>
                <li class="card-list-other">
                    <button class="btn forbiding">
                        <img src="public/iconfont/warn.png" alt="" class="forbid">
                        禁言
                    </button>
                    <button class="btn seal">
                        <img src="public/iconfont/forbid.png" alt="" class="forbid">
                        已封号
                    </button>
                </li>
            </ul>
            `
            }else{
                All += `
            <ul class="card-body-list">
                <li class="card-list-number">${i}</li>
                <li class="card-list-name">${all[i].name}</li>
                <li class="card-list-sex">${all[i].sex}</li>
                <li class="card-list-status">正常</li>
                <li class="card-list-mail">${all[i].mail}</li>
                <li class="card-list-other">
                    <button class="btn forbiding">
                        <img src="public/iconfont/warn.png" alt="" class="forbid">
                        禁言
                    </button>
                    <button class="btn seal">
                        <img src="public/iconfont/forbid.png" alt="" class="forbid">
                        封号
                    </button>
                </li>
            </ul>
            `
            }
            
        }
        card_body_main[0].innerHTML = All;
        page_current[0].maxNumber = result.data.msg.pages;
        page_current[0].all_size = result.data.msg.total;
        page_current[0].cur_index = result.data.msg.current;
        page_current[0].size = result.data.msg.size;
        console.log(page_current[0].maxNumber);
        renderPaging(renders,page_current[0].maxNumber,page_current[0].all_size,-1);
        for(let j=0;j<all.length;j++){
            seal[j].ids = all[j].id;
            if(result.data.msg.records[j].status == 1){
                seal[j].onclick = function(){
                    confirms[1].ids = all[j].id;
                    warn_text[0].innerHTML = '确定解除用户名为：' + all[j].name + '的封号嘛？'
                    hidden[1].style.display = 'block'
                }
            }else{
                seal[j].onclick = function(){
                    confirms[0].ids  = all[j].id;
                    hidden[0].style.display = 'block';
                }
            }
            
            forbiding[j].onclick = function(){
                let timing = getEndDate(30);
                console.log(timing);
            }
        }
    })
}
renders(1,5);


cancel[0].onclick  = function(){
    hidden[0].style.display = 'none';
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
            console.log(result.data);
            hidden[0].style.display = 'none';
            renders(page_current[0].cur_index,page_current[0].size,-1)
        })
    }
    console.log(arr[0]);
}


confirms[1].onclick = function(){
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
        console.log(result.data);
        hidden[1].style.display = 'none';
        renders(page_current[0].cur_index,page_current[0].size,-1)
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
ds();