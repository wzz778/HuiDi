let message_body=document.getElementsByClassName('messagebody')[0]
let pagecon=document.getElementsByClassName('main-right-bon')[0]
let pagearrow=pagecon.getElementsByTagName('a');
let fansnumber=document.getElementById('fansnumber');
let sortred=document.getElementsByClassName('sortred')
let nowpage=1;
let allpage=1;
console.log(thistype);
  //观看是否有消息
  axios({
    url: '/api/getUserIsMessage',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        if(data.data.msg){
            sortred[0].style.display='block'
        }
    }
  }).catch(function (error) {
    
  });
function getallmessage(){
    axios({
        method:'get',
        url:"/api/lookmymessage",
        params:{
            page:nowpage,
            size:7
        }
    }).then(data => {
        console.log(data.data);
        message_body.innerHTML=``;
        if(data.data.err==0){
            fansnumber.innerText=`共${data.data.msg.all_count}条数据`
            allpage=data.data.msg.all_page
            if(data.data.msg.list.length==0){
                message_body.innerHTML += `
                <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                    <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                    什么都没有呢 . . .
                </div>
            `;
            }else{
                let ms=data.data.msg.list;
                for(let i in ms){
                    let red=ms[i].status==0?'<div class="red"></div>':'<div class="red" style="display:none;"></div>';
                    if(ms[i].reflect_id!=null){
                        message_body.innerHTML += `
                            <div class="alike-a">
                                ${red}
                                <a href="userhomepage?id=${ms[i].ob.id}">
                                    <img src="public/img/userHead.jpg" class="message-img" alt="">
                                </a>
                                <div class="message-card">
                                    <div class="message-card-top">
                                        <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                        <span class="message-tpye">${ms[i].message}</span>
                                        <span class="message-userid" style="display: none;"></span>
                                    </div>
                                    <div class="message-card-bon">
                                        <a class="message-postname" href="dynamicDetails?id=${ms[i].reflect_id}">${ms[i].title}</a>
                                    </div>
                                </div>
                                <div class="message-con">
                                    <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                    <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                </div>
                            </div>
                        `
                    }else{
                        message_body.innerHTML += `
                        <div class="alike-a">
                            ${red}
                            <a href="userhomepage?id=${ms[i].ob.id}">
                                <img src="public/img/userHead.jpg" class="message-img" alt="">
                            </a>
                            <div class="message-card">
                                <div class="message-card-tops">
                                    <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                    <span class="message-tpye">${ms[i].types}了你：</span>
                                    <span class="message-userid" style="display: none;"></span>
                                </div>
                            </div>
                            <div class="message-con">
                                <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                            </div>
                        </div>
                        `
                    }
                }
            }
        }else{
    
        }
    }).catch(function (error) {
    
    });
}
if(thistype=='全部'){
    getallmessage()
}else{
    getallmessagebytype(thistype)
}
function lastpage(){
    nowpage=allpage;
    pagearrow[1].innerText=nowpage;
    if(thistype=='全部'){
        getallmessage()
    }else{
        getallmessagebytype()
    }
}
pagearrow[0].onclick=function(){
    if(nowpage<allpage){
        nowpage++; 
        pagearrow[1].innerText=nowpage;
        if(thistype=='全部'){
            getallmessage()
        }else{
            getallmessagebytype()
        }
    }
}
pagearrow[2].onclick=function(){
    if(nowpage>1){
        nowpage--; 
        pagearrow[1].innerText=nowpage;
        if(thistype=='全部'){
            getallmessage()
        }else{
            getallmessagebytype()
        }
    }
}
function getallmessagebytype(){
    axios({
        method:'get',
        url:"/api/lookmymessagebytype",
        params:{
            page:nowpage,
            size:7,
            type:thistype
        }
    }).then(data => {
        console.log(data.data);
        message_body.innerHTML=``;
        if(data.data.err==0){
            fansnumber.innerText=`共${data.data.msg.all_count}条数据`
            allpage=data.data.msg.all_page
            if(data.data.msg.list.length==0){
                message_body.innerHTML += `
                <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                    <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                    什么都没有呢 . . .
                </div>
            `;
            }else{
                let ms=data.data.msg.list;
                for(let i in ms){
                    let red=ms[i].status==0?'<div class="red"></div>':'<div class="red" style="display:none;"></div>';
                    if(thistype!="关注"){
                        message_body.innerHTML += `
                            <div class="alike-a">
                                ${red}
                                <a href="userhomepage?id=${ms[i].ob.id}">
                                    <img src="public/img/userHead.jpg" class="message-img" alt="">
                                </a>
                                <div class="message-card">
                                    <div class="message-card-top">
                                        <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                        <span class="message-tpye">${ms[i].message}</span>
                                        <span class="message-userid" style="display: none;"></span>
                                    </div>
                                    <div class="message-card-bon">
                                        <a class="message-postname" href="dynamicDetails?id=${ms[i].reflect_id}">${ms[i].title}</a>
                                    </div>
                                </div>
                                <div class="message-con">
                                    <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                    <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                </div>
                            </div>
                        `
                    }else{
                        message_body.innerHTML += `
                        <div class="alike-a">
                            ${red}
                            <a href="userhomepage?id=${ms[i].ob.id}">
                                <img src="public/img/userHead.jpg" class="message-img" alt="">
                            </a>
                            <div class="message-card">
                                <div class="message-card-tops">
                                    <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                    <span class="message-tpye">${ms[i].types}了你：</span>
                                    <span class="message-userid" style="display: none;"></span>
                                </div>
                            </div>
                            <div class="message-con">
                                <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                            </div>
                        </div>
                        `
                    }
                }
            }
        }else{
    
        }
    }).catch(function (error) {
    
    });
}