


let forbiding = document.getElementsByClassName('forbiding');
let cancel = document.getElementsByClassName('cancel');
let confirms  = document.getElementsByClassName('confirm')
let hidden = document.getElementsByClassName('hidden');
let seal = document.getElementsByClassName('seal');
let main = document.getElementsByClassName('main');
let card_body = document.getElementsByClassName('card-body');
let card_body_main = document.getElementsByClassName('card-body-main');

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
                        封号
                    </button>
                </li>
            </ul>
            `
        }
        card_body_main[0].innerHTML = All;
        page_current[0].maxNumber = result.data.msg.pages;
        page_current[0].all_size = result.data.msg.total;
        console.log(page_current[0].maxNumber);
        renderPaging(renders,page_current[0].maxNumber,page_current[0].all_size);
        for(let j=0;j<all.length;j++){
            seal[j].ids = all[j].id;
            seal[j].onclick = function(){
                confirms[0].ids  = all[j].id;
                hidden[0].style.display = 'block';
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
    let idnex = select.selectedIndex;
    let values = select.options[idnex].value;
    let timing = getEndDate(values);
    if(values != ''){
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
        })
    }
    console.log(values);
    hidden[0].style.display = 'none';
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
	var newTimes = Date.now() + 3600000*24*(day); //(day-1)天后的毫秒值，3600000 为1小时的毫秒值
    return getNowTime(newTimes);
}
