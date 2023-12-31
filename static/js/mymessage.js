let message_body=document.getElementsByClassName('messagebody')[0]
let pagecon=document.getElementsByClassName('main-right-bon')[0]
let pagearrow=pagecon.getElementsByTagName('a');
let fansnumber=document.getElementById('fansnumber');
let clearall=document.getElementsByClassName('clearall')[0]
let nowpage=1;
let allpage=1;
let sortred=document.getElementsByClassName('sortred')
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
  axios({
    url: '/api/getUserIsChat',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        if(data.data.msg){
            sortred[1].style.display='block'
        }
    }
  }).catch(function (error) {
    
  });
function del_one_me(event){ 
    reconfirm("删除信息","您确定要删除该条信息？",function(){
        let thisid=event.parentNode.children[3].innerHTML;
        let arrid=new Array()
        arrid.push(thisid)
        axios({
            method:'post',
            url:"/api/deletemymessage",
            data:arrid
        }).then(data => {
            // console.log(data.data);
            if(data.data.err==0){
                if(thistype=='全部'){
                    getallmessage()
                }else{
                    getallmessagebytype()
                }
                hintFn('success', "删除成功！")
            }else{
                hintFn('wrong', "删除失败！")
            }
        }).catch(err=>{
    
        })
        closeconfirm()
    })
}
function del_all(){ 
    let arrid=new Array()
    let me_id=document.getElementsByClassName('me_id');
    for(let i of me_id){
        arrid.push(i.innerHTML)
    }
    axios({
        method:'post',
        url:"/api/deletemymessage",
        data:arrid
    }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            if(allpage>1){
                allpage--;
            }
            if(nowpage>1){
                nowpage--;
            }
            if(thistype=='全部'){
                getallmessage()
            }else{
                getallmessagebytype()
            }
            hintFn('success', "删除成功！")
        }else{
            hintFn('wrong', "删除失败！")
        }
    }).catch(err=>{
        
    })
}
clearall.onclick=function(){
    reconfirm("删除信息","你确定要清空该页信息",del_all)
};
function getallmessage(){
    axios({
        method:'get',
        url:"/api/lookmymessage",
        params:{
            page:nowpage,
            size:7
        }
    }).then(data => {
        // console.log(data.data);
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
                                    <img src="${ms[i].ob.img_url}" class="message-img" alt="">
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
                                    <button class="message-delete" onclick="del_one_me(this)"><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                    <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                    <span class="me_id">${ms[i].id}</span>
                                </div>
                            </div>
                        `
                    }else{
                        message_body.innerHTML += `
                        <div class="alike-a">
                            ${red}
                            <a href="userhomepage?id=${ms[i].ob.id}">
                                <img src="${ms[i].ob.img_url}" class="message-img" alt="">
                            </a>
                            <div class="message-card">
                                <div class="message-card-tops">
                                    <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                    <span class="message-tpye">${ms[i].types}了你：</span>
                                    <span class="message-userid" style="display: none;"></span>
                                </div>
                            </div>
                            <div class="message-con">
                                <button class="message-delete" onclick="del_one_me(this)"><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                <span class="me_id">${ms[i].id}</span>
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
        // console.log(data.data);
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
                                    <img src="${ms[i].ob.img_url}" class="message-img" alt="">
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
                                    <button class="message-delete" onclick="del_one_me(this)"><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                    <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                    <span class="me_id">${ms[i].id}</span>
                                </div>
                            </div>
                        `
                    }else{
                        message_body.innerHTML += `
                        <div class="alike-a">
                            ${red}
                            <a href="userhomepage?id=${ms[i].ob.id}">
                                <img src="${ms[i].ob.img_url}" class="message-img" alt="">
                            </a>
                            <div class="message-card">
                                <div class="message-card-tops">
                                    <a href="userhomepage?id=${ms[i].ob.id}" class="message-username">${ms[i].ob.name}</a>
                                    <span class="message-tpye">${ms[i].types}了你：</span>
                                    <span class="message-userid" style="display: none;"></span>
                                </div>
                            </div>
                            <div class="message-con">
                                <button class="message-delete" onclick="del_one_me(this)"><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                                <span class="message-time">${contrasttime(ms[i].create_time)}</span>
                                <span class="me_id">${ms[i].id}</span>
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