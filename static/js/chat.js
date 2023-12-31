let chattext = document.getElementById('chattext');
let chattextnumber = document.getElementById('chattextnumber');
let toid = window.location.search.split("=")[1];
let messagebody = document.getElementsByClassName('messagebody')[0]
let chatusername = document.getElementsByClassName('chatusername')[0];
let useronline = document.getElementsByClassName('online');
let lookmore = document.getElementById('lookmore');
let lookend = document.getElementById('lookend');
let sortred = document.getElementsByClassName('sortred')
let userimg = '/public/img/userHead.jpg';
let myimg = '/public/img/userHead.jpg';
let sendchat = document.getElementById('sendchat');
let isin = false;
let fromid;
let isfollow= true;
function send() { }
if(toid!=1000){
  axios({
    url: '/api/eachfollow',
    method: 'get',
    params:{
        userid:toid
    }
  }).then(data => {
    if(data.data.err==-1){
      isfollow= false;
      hintFn('warning',"用户没有互相关注！")
        // setTimeout(function () {
        //     window.location.assign(`/`);
        // }, 1000)
        return
    }
  })
  .catch(function (error) {
    // console.log(error);
  });
}
//观看是否有消息
axios({
  url: '/api/getUserIsMessage',
  method: 'get',
}).then(data => {
  if (data.data.err == 0) {
    if (data.data.msg) {
      sortred[0].style.display = 'block'
    }
  }
}).catch(function (error) {

});
axios({
  url: '/api/getUserIsChat',
  method: 'get',
}).then(data => {
  if (data.data.err == 0) {
    if (data.data.msg) {
      sortred[1].style.display = 'block'
    }
  }
}).catch(function (error) {

});
function getTime() {
  var result = 0;
  var time = new Date();
  var h = time.getHours();
  h = h < 10 ? '0' + h : h;
  var m = time.getMinutes();
  m = m < 10 ? '0' + m : m;
  var s = time.getSeconds();
  s = s < 10 ? '0' + s : s;
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  var dates = time.getDate();
  var result = year + '-' + month + '-' + dates + ' ' + h + ':' + m + ':' + s;
  return result;
}//获取当前时间
function getprTime() {
  let chattime = document.getElementsByClassName('chattime');
  chattime = chattime[chattime.length - 1].innerHTML;
  return chattime
}//获取的最后一个时间框的时间
function getfirstTime() {
  let chattime = document.getElementsByClassName('chattime');
  chattime = chattime[0].innerHTML;
  return chattime
}//获取的最后第一个时间框的时间
function recontrasttime(time, nowtime) {
  let data = new Date(time.replace(/-/g, "/"));
  let t1 = new Date(nowtime.replace(/-/g, "/"));
  let times = t1.getTime() - data.getTime();
  let days = parseInt(times / (24 * 1000 * 3600));
  if (days > 0) {
    return false;
  }
  let leave = times % (24 * 3600 * 1000);
  let h = parseInt(leave / (3600 * 1000));
  if (h > 0) {
    return false;
  }
  let h_leave = leave % (3600 * 1000);
  let min = parseInt(h_leave / (60 * 1000));

  if (min == 1 || min == 0) {
    return true;
  } else {
    return false;
  }
}//比较以前和现在两者的时间，来判断是否添加时间框
function fromusermessage() {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/getmymessage',
      method: 'get',
    }).then(data => {
      // console.log(data.data);
      if (data.data.err == 0) {
        let me = data.data.msg;
        fromid = me.id;
        if (me.img_url != null) {
          myimg = me.img_url;
        }
        resolve(me.id)
      } else {
        reject(data.data.msg)
      }
    }).catch(function (error) {
      reject('获取失败！')
    });
  })
}
function tousermessage() {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api/getusermessage',
      method: 'get',
      params: {
        id: toid
      }
    }).then(data => {
      if (data.data.err == 0) {
        let me = data.data.msg;
        if (me.img_url != null) {
          userimg = me.img_url;
        }
        chatusername.innerHTML = me.name;
        chatusername.href = `userhomepage?id=${me.id}`;
        resolve()
      } else {
        reject(data.data.msg)
      }
    })
      .catch(function (error) {
        reject('获取失败！')
      });
  })
}
let nowpage = 1;
let allpage = 1;
var firsttime='2022-10-10 12:00:00'
function getallchat() {
  axios({
    url: '/api/lookallchat',
    method: 'get',
    params: {
      toid: fromid,
      fromid: toid,
      page: nowpage,
      size: 10
    }
  }).then(data => {
    // console.log(data.data);
    if (data.data.err == 0) {
      let list = data.data.msg.list;
      let le = list.length;
      if(le==0){
        lookmore.style.display = 'none';
        lookend.style.display = 'block';
        return
      } 
      allpage = data.data.msg.all_page;
      if(nowpage==data.data.msg.all_page){
        lookmore.style.display = 'none';
        lookend.style.display = 'block';
      }
      let messagepage=document.createElement('div');
      messagepage.className = 'messagepage';
      let firstpage=document.getElementsByClassName('messagepage')[0]
      for (let i = le-1; i >=0; i--) {
        let nowhtml = document.createElement('div');
        nowhtml.className = 'amessage';
        if (!recontrasttime(firsttime,list[i].info_create_time)) {
          firsttime=list[i].info_create_time;
          if (list[i].info_u_id == fromid) {
            nowhtml.innerHTML = `
              <div class="chattimebox"><span class="chattime">${list[i].info_create_time}</span></div>
              <div class="chat mychat">
                <img src="${myimg}" alt="">
                <div class="chattext">${list[i].info_message}</div>
              </div>
            `
          } else {
            nowhtml.innerHTML = `
            <div class="chattimebox"><span class="chattime">${list[i].info_create_time}</span></div>
            <div class="chat otherchat">
              <img src="${userimg}" alt="">
              <div class="chattext">${list[i].info_message}</div>
            </div>
          `
          }
        } else {
          if (list[i].info_u_id == fromid) {
            nowhtml.innerHTML = `
              <div class="chat mychat">
                <img src="${myimg}" alt="">
                <div class="chattext">${list[i].info_message}</div>
              </div>
            `
          } else {
            nowhtml.innerHTML = `
              <div class="chat otherchat">
                <img src="${userimg}" alt="">
                <div class="chattext">${list[i].info_message}</div>
              </div>
            `
          }
        }
        // console.log(nowhtml);
        messagepage.append(nowhtml)
      }
      // console.log(firstpage);
      firstpage.parentNode.insertBefore(messagepage, firstpage);
      firsttime='2022-10-10 12:00:00'
      if (nowpage != allpage) {
        lookmore.style.display = 'block';
        lookend.style.display = 'none';
      } else {
        lookmore.style.display = 'none';
        lookend.style.display = 'block';
      }
      if (nowpage == 1) {
        messagebody.scrollTop = messagebody.scrollHeight;
      }else{
        messagebody.scrollTop=messagebody.scrollHeight-lastscrollHeight;
      }
    } else {

    }
  }).catch(function (error) {
    console.log(error);
  });
}
chattext.onkeyup = function () {
  var len = chattext.value.length;
  if (len > 199) {
    chattext.value.substring(0, 200);
  }
  var num = len;
  chattextnumber.innerText = num;
  if (event.keyCode == 13) {
    send();
  }
};
chattext.onkeydown = function () {
  var len = chattext.value.length;
  if (len > 199) {
    chattext.value = chattext.value.substring(0, 200);
  }
  var num = len;
  chattextnumber.innerText = num;
};
var websocket = null;
var creatws = function (userid) {
  if ('WebSocket' in window) {
    //用于创建WebSocket对象，webSocketTest对应的是java类的注解值
    websocket = new WebSocket(`ws://152.136.99.236:8080/websocket/${userid}`);
  } else {
    hintFn("wrong", "当前浏览器不支持")
  }
  //连接发生错误的时候回调方法；
  websocket.onerror = function () {
    hintFn("warning", "连接错误")
    // alert("连接错误");
  }
  //连接成功时建立回调方法
  websocket.onopen = function () {
    //WebSocket已连接上，使用send()方法发送数据
    // hintFn("success", "连接成功")
    // alert("连接成功");
  };
  //  收到消息的回调方法
  websocket.onmessage = function (msg) {
    let data = JSON.parse(msg.data)
    if (data.users != undefined) {
      for (let i of data.users) {
        if (i.userId == toid) {
          useronline[0].style.display = 'block'
          useronline[1].style.display = 'none'
        }
      }
      return
    } else {
      if (!recontrasttime(getprTime(), getTime())) {
        messagebody.innerHTML += `
        <div class="amessage">
          <div class="chattimebox"><span class="chattime">${getTime()}</span></div>
          <div class="chat otherchat">
              <img src="${userimg}" alt="">
              <div class="chattext">${data.text}</div>
          </div>
        </div>
    `
      } else {
        messagebody.innerHTML += `
        <div class="amessage">
          <div class="chat otherchat">
              <img src="${userimg}" alt="">
              <div class="chattext">${data.text}</div>
          </div>
        </div>
    `
      }//渲染数据
      if (nowpage == 1) {
        messagebody.scrollTop = messagebody.scrollHeight;
      }
    }
  };
  //连接关闭的回调方法
  websocket.onclose = function () {
    closed();
    isFinite('warning', "连接已关闭")
    // alert("关闭成功");
  };
  function closed() {
    websocket.close();
    isFinite('warning', "连接已关闭")
    // alert("点击关闭");
  }
  function sendchatmessage(){
    if(isfollow==false){
      hintFn('warning', "用户没有互相关注！")
      return
    }
    if (isnull(judgeStrs(chattext.value))) {
      hintFn('warning', "请输入你要输入的内容")
      return
    }
    let newob = {
      to: toid,
      from: fromid,
      text: judgeStrs(chattext.value),
    }
    if (!recontrasttime(getprTime(), getTime())) {
      messagebody.innerHTML += `
      <div class="amessage">
        <div class="chattimebox"><span class="chattime">${getTime()}</span></div>
        <div class="chat mychat">
          <img src="${myimg}" alt="">
          <div class="chattext">${judgeStrs(chattext.value)}</div>
        </div>
      </div>
        `
    } else {
      messagebody.innerHTML += `
        <div class="amessage">
          <div class="chat mychat">
            <img src="${myimg}" alt="">
            <div class="chattext">${judgeStrs(chattext.value)}</div>
          </div>
        </div>
        `
    }
    websocket.send(JSON.stringify(newob)); //给后台发送数据
    messagebody.scrollTop = messagebody.scrollHeight;
    chattext.value = ``
  }
  chattext.addEventListener("keyup",function(event){
      if(event.keyCode==13){
        sendchatmessage()
      }
  });
  sendchat.onclick = function () {
    sendchatmessage()
  }
}
function beginall() {
  tousermessage().then(result1 => {
    return fromusermessage()
  }).then(resultid => {
    getallchat()
    creatws(resultid)
  }).catch(err => {
    // console.log(err);
  })
}
beginall()
let lastscrollHeight;
messagebody.onscroll = function () {
  let scrollTop = messagebody.scrollTop;
  let scrollHeight = messagebody.scrollHeight;
  if (scrollTop == 0) {
    lastscrollHeight=scrollHeight;
    if (allpage > nowpage) {
      nowpage++;
      setTimeout(function () { getallchat() }, 1000)
    } else {
    }
  }
};
