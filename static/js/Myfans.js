let message_body=document.getElementById('message_body');
let pagecon=document.getElementsByClassName('main-right-bon')[0]
let pagearrow=pagecon.getElementsByTagName('a');
let fansnumber=document.getElementById('fansnumber');
function tofollow(id,event){
    let followbutton=event.parentElement.getElementsByClassName('message-operation')
    axios({
        url: '/api/addfollow',
        method: 'post',
        data:{
            userid:id
        }
      }).then(data => {
        console.log(data.data);
        if(data.data.err==0){
            if(data.data.msg=='success'){
                followbutton[0].style.display='none'
                followbutton[1].style.display='block'
            }else{
                followbutton[1].style.display='none'
                followbutton[0].style.display='block'
            }
        }else{
            hintFn('warning' ,data.data.msg)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}
function outfollow(id,event){
    let followbutton=event.parentElement.getElementsByClassName('message-operation')
    axios({
        url: '/api/deletefollow',
        method: 'get',
        params:{
            userid:id
        }
      }).then(data => {
        console.log(data.data);
        
        if(data.data.err==0){
            if(data.data.msg=='success'){
                followbutton[1].style.display='none'
                followbutton[0].style.display='block'
            }else{
                followbutton[0].style.display='none'
                followbutton[1].style.display='block'
            }
        }else{
            hintFn('warning' ,data.data.msg)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}
let nowpage=1;
let allpage=1;
function getfan(){
    axios({
        method:'get',
        url:"/api/lookmyfans",
        params:{
            page:nowpage,
            size:5
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
                    let sex=ms[i].sex=='男'?'public/img/man.png':'public/img/woman.png';
                    let button;
                    if(ms[i].havefollow){
                        button=`
                            <button class="message-operation" style="display: none;" onclick="tofollow(${ms[i].id},this)">关注</button>
                            <button class="message-operation" style=" border: 1px solid #ccccd8;color: #7d7d81;" onclick="outfollow(${ms[i].id},this)">取消关注</button>
                        `
                    }else{
                        button=`
                        <button class="message-operation" onclick="tofollow(${ms[i].id},this)">关注</button>
                        <button class="message-operation" style=" border: 1px solid #ccccd8;color: #7d7d81;display: none;" onclick="outfollow(${ms[i].id},this)">取消关注</button>`
                    }
                    message_body.innerHTML += `
                        <div class="alike-a">
                            <div class="red"></div>
                            <a href="userhomepage?id=${ms[i].id}">
                                <img src="${ms[i].img_url}" class="message-img" alt="">
                            </a>
                            <div class="message-card">
                                <div class="message-card-top">
                                    <a href="userhomepage?id=${ms[i].id}" class="message-username">${ms[i].name}</a>
                                    <span class="message-tpye">关注了你：</span>
                                    <span class="message-userid" style="display: none;">${ms[i].id}</span>
                                </div>
                                <div class="message-card-bon">
                                    <img src="${sex}" alt="">
                                    <div><span>描述：</span>${ms[i].describes}</div>
                                </div>
                            </div>
                            <div class="message-con">
                                ${button}</br>
                                <a href="" class="send_message">私信</a>
                                <span class="message-time">${contrasttime(ms[i].end_time)}</span>
                            </div>
                        </div>
                    `
                }
            }
        }else{
    
        }
    }).catch(function (error) {
        console.log(error);
    });
}
getfan()
function lastpage(){
    nowpage=allpage;
    pagearrow[1].innerText=nowpage;
    getfan()
}
pagearrow[0].onclick=function(){
    if(nowpage<allpage){
        nowpage++; 
        pagearrow[1].innerText=nowpage;
        getfan()
    }
}
pagearrow[2].onclick=function(){
    if(nowpage>1){
        nowpage--; 
        pagearrow[1].innerText=nowpage;
        getfan()
    }
}