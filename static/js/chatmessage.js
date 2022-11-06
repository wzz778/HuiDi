let sortred=document.getElementsByClassName('sortred')
let message_body=document.getElementsByClassName('messagebody')[0]
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
  function getallchatuser(){
    axios({
        method:'get',
        url:"/api/lookallchatuser",
    }).then(data => {
        console.log(data.data);
        if(data.data.err==0){
            let ms=data.data.msg;
            if(ms.length==0){
                message_body.innerHTML == `
                <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                    <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                    什么都没有呢 . . .
                </div>
            `;
            }else{
                for(let i in ms){
                    let red=null;
                    if(ms[i].date.unreadMessages==0){
                        red=`<div class="red" style='display:none;'></div>`
                    }else{
                        red=`<div class="red">${ms[i].date.unreadMessages}</div>`
                    }
                    message_body.innerHTML += `
                    <div class="alike-a">
                            ${red}
                        <a href="userhomepage?id=${ms[i].users.id}">
                            <img src="${ms[i].users.img_url}" class="message-img" alt="">
                        </a>
                        <div class="message-card">
                            <div class="message-card-top">
                                <a href="userhomepage?id=${ms[i].users.id}" class="message-username">${ms[i].users.name}</a>
                                <span class="message-tpye">给你发的消息：</span>
                                <span class="message-userid" style="display: none;"></span>
                                <a href="chat?id=${ms[i].users.id}" class="sendbutton">给 TA 发信息</a>
                            </div>
                            <div class="message-card-bon">
                                <a class="message-postname" href="chat?id=${ms[i].users.id}">${ms[i].date.lastInfo.info_message}</a>
                            </div>
                        </div>
                        <div class="message-con">
                            <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                            <span class="message-time">${contrasttime(ms[i].date.lastInfo.info_create_time)}</span>
                        </div>
                    </div>
                    `
                }
            }
        }else{
    
        }
    }).catch(function (error) {
        // console.log(error);
    });
  }
  function getallnowchatuser(){
    axios({
        method:'get',
        url:"/api/lookallnowchatuser",
    }).then(data => {
        console.log(data.data);
        if(data.data.err==0){
            let ms=data.data.msg.list;

            if(ms.length==0){
                message_body.innerHTML == `
                <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                    <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                    什么都没有呢 . . .
                </div>
            `;
            }else{
                for(let i in ms){
                    red=`<div class="red"></div>`
                    message_body.innerHTML += `
                    <div class="alike-a">
                            ${red}
                        <a href="userhomepage?id=${ms[i].users.id}">
                            <img src="${ms[i].users.img_url}" class="message-img" alt="">
                        </a>
                        <div class="message-card">
                            <div class="message-card-top">
                                <a href="userhomepage?id=${ms[i].users.id}" class="message-username">${ms[i].users.name}</a>
                                <span class="message-tpye">给你发的消息：</span>
                                <span class="message-userid" style="display: none;"></span>
                                <a href="chat?id=${ms[i].users.id}" class="sendbutton">给 TA 发信息</a>
                            </div>
                            <div class="message-card-bon">
                                <a class="message-postname" href="chat?id=${ms[i].users.id}">${ms[i].date.lastInfo.info_message}</a>
                            </div>
                        </div>
                        <div class="message-con">
                            <button class="message-delete" ><i class="fa fa-trash-o" aria-hidden="true"></i></button></br>
                            <span class="message-time">${contrasttime(ms[i].date.lastInfo.info_create_time)}</span>
                        </div>
                    </div>
                    `
                }
            }
        }else{
    
        }
    }).catch(function (error) {
        // console.log(error);
    });
  }
  var url = window.location.href; //要切割的链接
  var index = url.lastIndexOf("\/");
  str = url.substring(index,index.length);
if(str=='/chatmessage'){
    getallchatuser()
}else{
    getallnowchatuser()
}