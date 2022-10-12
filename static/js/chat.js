let chattext=document.getElementById('chattext');
let chattextnumber=document.getElementById('chattextnumber');
let fromid = window.location.search.split("=")[1].split("&")[0];
let toid = window.location.search.split("=")[2];
let messagebody=document.getElementsByClassName('messagebody')[0]
let chatusername=document.getElementsByClassName('chatusername')[0];
let useronline=document.getElementsByClassName('online');
let userimg='/public/img/userHead.jpg';
let myimg='/public/img/userHead.jpg';
let formid;
function getTime() {
  var result = 0;
  var time = new Date();
  var h = time.getHours();
  h = h < 10 ? '0' + h : h;
  var m = time.getMinutes();
  m = m < 10 ? '0' + m : m;
  var s= time.getSeconds();
  s = s < 10 ? '0' + s : s;
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  var dates = time.getDate();
  var result = year + '-' + month + '-' + dates + ' ' + h + ':' + m+ ':' + s;
  return result;
}
function getprTime() {
  let chattime=document.getElementsByClassName('chattime');
  chattime=chattime[chattime.length-1].innerHTML;
  return chattime
}
function recontrasttime(time,nowtime){
  let data=new Date(time.replace(/-/g,"/"));
  let t1=new Date(nowtime.replace(/-/g,"/"));//获取当前时间
  let times=t1.getTime()-data.getTime();
  let days=parseInt(times/(24*1000*3600));
  if(days>0){
      return false;
  }
  let leave=times%(24*3600*1000);
  let h=parseInt(leave/(3600*1000));
  if(h>0){
    return false;
  }
  let h_leave=leave%(3600*1000);
  let min=parseInt(h_leave/(60*1000));

  if(min==1||min==0){
      return true;
  }else{
      return false;
  }
}
axios({
  url: '/api/getusermessage',
  method: 'get',
  params:{
      id:toid
  }
}).then(data => {
  if(data.data.err==0){
      let me=data.data.msg;
      if(me.img_url!=null){
        userimg=me.img_url;
      }
      chatusername.innerHTML=me.name;
  }else{

  }
})
.catch(function (error) {
  console.log(error);
});

axios({
  url: '/api/getmymessage',
  method: 'get',
}).then(data => {
  console.log(data.data);
  if(data.data.err==0){
    let me=data.data.msg;
    formid=me.id;
    if(me.img_url!=null){
      myimg=me.img_url;
    }
  }else{

}
}).catch(function (error) {
  
});

chattext.onkeyup=function(){
    var len = chattext.value.length;
    if(len > 199){
        chattext.value.substring(0,200);
    }
    var num = len;
    chattextnumber.innerText=num;
};
chattext.onkeydown=function(){
  var len = chattext.value.length;
  if(len > 199){
    chattext.value=chattext.value.substring(0,200);
  }
  var num = len;
  chattextnumber.innerText=num;
};
// 与websocket服务器创建连接
// function createWebSocket() {
//     // 注意这里的端口号是后端服务的端口号，后面的是后端正常请求的路径，ziyuan是我的项目名，最后面的是我放在cookie中的当前登陆用户
//     let websocket = new WebSocket('http://152.136.99.236:8080/websocket/5')
//     // 连接成功时
//     websocket.onopen = () => {
//       // websocket.send('hello')
//     }
//     websocket.onmessage = event => {
//       // 后端发送的消息在event.data中
//       console.log(event.data)
//     }
//     websocket.onclose = function () {
//       console.log('关闭了')
//     }
//     // 路由跳转时结束websocket链接
//     this.$router.afterEach(function () {
//       websocket.close()
//     })
//     // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
//     window.onbeforeunload = function () {
//       websocket.close()
//     }
//   }
//   createWebSocket()
var websocket = null;
if ('WebSocket' in window) {
    //用于创建WebSocket对象，webSocketTest对应的是java类的注解值
    websocket = new WebSocket(`ws://152.136.99.236:8080/websocket/${fromid}`);
} else {
    alert("当前浏览器不支持");
}
//        连接发生错误的时候回调方法；
websocket.onerror = function () {
    alert("连接错误");
}
//       连接成功时建立回调方法
websocket.onopen = function () {
    //WebSocket已连接上，使用send()方法发送数据
    alert("连接成功");
};
//      收到消息的回调方法
websocket.onmessage = function (msg) {
  let data=JSON.parse(msg.data)
  console.log(msg.data);
  console.log(data);
  if(data.users!=undefined){
    for(let i of data.users){
      if(i.userId==toid){
        useronline[0].style.display='block'
        useronline[1].style.display='none'
      }
    }
    return
  }else{
    if(!recontrasttime(getprTime(),getTime())){
      messagebody.innerHTML+=`
      <div class="amessage">
        <div class="chattimebox"><span class="chattime">${getTime()}</span></div>
        <div class="chat otherchat">
            <img src="${userimg}" alt="">
            <div class="chattext">${data.text}</div>
        </div>
      </div>
    `
    }else{
      messagebody.innerHTML+=`
      <div class="amessage">
        <div class="chat otherchat">
            <img src="${userimg}" alt="">
            <div class="chattext">${data.text}</div>
        </div>
      </div>
    `
    }
  messagebody.scrollTop = messagebody.scrollHeight;
  }
  // console.log(JSON.parse(msg.data));
    // setdivInnerHTML(msg.data);
};
//连接关闭的回调方法
websocket.onclose = function () {
  closed();
  alert("关闭成功");
};

function closed() {
  websocket.close();
  alert("点击关闭");
}

function send() {//注意引号内的内容应该是文本框的id而不能是name
  let newob={
    to:toid,
    from:fromid,
    text:chattext.value,
  } 
  alert(JSON.stringify(newob))
  websocket.send(JSON.stringify(newob)); //给后台发送数据
  if(!recontrasttime(getprTime(),getTime())){
    messagebody.innerHTML+=`
    <div class="amessage">
      <div class="chattimebox"><span class="chattime">${getTime()}</span></div>
      <div class="chat mychat">
          <img src="${myimg}" alt="">
          <div class="chattext">${chattext.value}</div>
      </div>
    </div>
  `
  }else{
    messagebody.innerHTML+=`
    <div class="amessage">
      <div class="chat mychat">
          <img src="${myimg}" alt="">
          <div class="chattext">${chattext.value}</div>
      </div>
    </div>
  `
  }
  messagebody.scrollTop = messagebody.scrollHeight;
}