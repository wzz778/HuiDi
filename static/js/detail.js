let hidden = document.getElementsByClassName('hidden');
let download = document.getElementsByClassName('download');
let cancel = document.getElementsByClassName('cancel');
let clear = document.getElementsByClassName('clear');
let pass = document.getElementsByClassName('pass');
let returnBack = document.getElementsByClassName('returnBack');
let confirms = document.getElementsByClassName('confirm');
let id = window.location.search.replace('?','').split('=');
let application_message = document.getElementsByClassName('application-message');
let classifier_input = document.getElementsByClassName('classifier-input');
let imgings = document.getElementsByClassName('imgings');
let returns = document.getElementsByClassName('returns');
console.log(id);


pass[0].onclick = function(){
    hidden[0].style.display = 'block';
}


cancel[0].onclick = function(){
    hidden[0].style.display = 'none';
}
confirms[0].onclick = function(){
    axios({
        method:'GET',
        url:'/superAdmin/updateStatus',
        params:{
            id:id[1]
        }
    }).then(result =>{
        console.log(result.data);
        if(result.data.msg == 'success'){
            hidden[0].style.display = 'none';
        }
    })
    
}
cancel[1].onclick = function(){
    hidden[1].style.display = 'none';
}
confirms[1].onclick = function(){
    if(classifier_input[0].value != ''){
        axios({
            method:'GET',
            url:'/superAdmin/updatePass',
            params:{
                id:id[1],
                message:classifier_input[0].value
            }
        }).then(result =>{
            console.log(result.data);
            if(result.data.msg == 'success'){
                hidden[1].style.display = 'none';
            }
        })
    }
}

returnBack[0].onclick = function(){
    hidden[1].style.display = 'block'
}


function renders(id){
    axios({
        method:'get',
        url:'/superAdmin/showAllNoPasss',
        params:{
            begin_index:1,
            size:1,
            id:id
        }
    }).then(result =>{
        console.log(result.data);
        let all = '';
        if(result.data.msg.list[0].list.length == 0){
            all = `<ul class="messages">
        <li>
            作者：
            <span class="name">${result.data.msg.list[0].users.name}</span>
        </li>
        <li>
            性别：
            <span class="sex">${result.data.msg.list[0].users.sex}</span>
        </li>
        <li>
            邮箱：
            <span>${result.data.msg.list[0].users.mail}</span>
        </li>
        <li>
            作品创建时间：
            <span class="name">${result.data.msg.list[0].images.create_time}</span>
        </li>
        </ul>
        <div class="parctice-content">
            <span class="content-title">内容详情：</span>
            <div class="content-main">
                <span class="content-title">${result.data.msg.list[0].images.describes}</span>
                <div class="imgings">

                </div>
            </div>
        </div>`
        application_message[0].innerHTML = all;
        }else{
                all = `<ul class="messages">
                            <li>
                                作者：
                                <span class="name">${result.data.msg.list[0].users.name}</span>
                            </li>
                            <li>
                                性别：
                                <span class="sex">${result.data.msg.list[0].users.sex}</span>
                            </li>
                            <li>
                                邮箱：
                                <span>${result.data.msg.list[0].users.mail}</span>
                            </li>
                            <li>
                                作品创建时间：
                                <span class="name">${result.data.msg.list[0].images.create_time}</span>
                            </li>
                            </ul>
                            <div class="parctice-content">
                                <span class="content-title">内容详情：</span>
                                <div class="content-main">
                                    <span class="content-title">${result.data.msg.list[0].images.describes}</span>
                                    <div class="imgings">

                                    </div>
                                </div>
                            </div>`

                            application_message[0].innerHTML = all;
                            let All = '';
                            for(let i=0;i<result.data.msg.list[0].list.length;i++){
                                All +=`<img src="${result.data.msg.list[0].list[i]}" alt="" class="content-img">`
                            }
                            imgings[0].innerHTML = All;
        }
    })
}
renders(id[1]);
returns[0].onclick = function (){
    window.history.go(-1);
}