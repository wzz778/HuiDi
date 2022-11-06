let textmessage=document.getElementsByClassName('textmessage');
let conli=document.getElementsByClassName('conli');
let cordimg=document.getElementById('cordimg')
let seximg=document.getElementsByClassName('seximg')[0]
let cord_contentHead=document.getElementById('cord-contentHead')
let useremail=document.getElementsByClassName('useremail')
let mynumber=document.getElementsByClassName('mynumber')
let class_body1=document.getElementsByClassName('class_body')[0]
let albumbody=document.getElementById('albumbody');
let collect_body=document.getElementsByClassName('class_body')[2]
let album=document.getElementById('album')
let dynumber=document.getElementById('dynumber')
let lookmore=document.getElementById('lookmore')
let lookend=document.getElementById('lookend')
let album_input=document.getElementsByClassName('album_input');
let followbutton=document.getElementsByClassName('followbutton')
let userid = window.location.search.split("=")[1];
let mymessageback=document.getElementById('mymessageback')
let myalbumbox=document.getElementsByClassName('myalbumbox')[0];
let mydetext=document.getElementById('mydetext')
let dyshow=true;
let colshow=false;
axios({
    url: '/api/isuser',
    method: 'get',
    params:{
        id:userid
    }
  }).then(data => {
    if(data.data.err==0){
       if(data.data.msg){
            window.location.assign("/Personalhomepage");
       }else{
        return
       }
    }else{
        return 
    }
  })
  .catch(function (error) {
    // console.log(error);
  });
let arrfun=[
    function(){
        dyshow=true;
        colshow=false;
    },
    function(){
        dyshow=false;
        colshow=false;
        lookmore.style.display='none';
        lookend.style.display='block';
    },
    function(){
        dyshow=false;
        colshow=true;
    },
]
function changeclass(i){
    conli[i].classList.add('havebethis');
    textmessage[i].style.display='block';
    lookmore.style.display='block';
    lookend.style.display='none';
    arrfun[i]()
    for(let n=0;n<3;n++){
        if(n!=i){
            conli[n].classList.remove('havebethis');
            textmessage[n].style.display='none';
        };
    };
}
axios({
    url: '/api/getusermessage',
    method: 'get',
    params:{
        id:userid
    }
  }).then(data => {
    console.log(data);
    if(data.data.err==0){
        let me=data.data.msg;
        mydetext.innerHTML=me.describes;
        let seximg=`<img src="/public/img/man.png" class="seximg" alt="">`
        if(me.sex!="男"){
            seximg=`<img src="/public/img/woman.png" class="seximg" alt="">`;
        }
        if(me.background!=null){
            mymessageback.style.backgroundImage=`url(${me.background})`;
        }
        if(me.img_url!=null){
            cordimg.style.backgroundImage=`url(${me.img_url})`;
        }
        if(me.certification!=null){
            cord_contentHead.innerHTML=`${me.name}${seximg}<span style="padding-left:15px;font-size: 16px;color:#b87100;"><i><img src="/public/iconfont/authentication.png" alt=""></i>认证领域：<span style="color:#669ddf;">${me.certification}</span></span>`;
        }else{
            cord_contentHead.innerHTML=`${me.name}${seximg}`;
        }
        useremail[0].innerHTML=`<a href="javascript:;" onclick="tochat()">给TA发私信</a>`;
        return axios({url: '/api/getusernumber',method: 'get', params:{
            id:userid
        }})
    }else{
    }
  }).then(data1 => {
    let number=data1.data.msg;
    mynumber[0].innerHTML=number.关注数;
    mynumber[1].innerHTML=number.粉丝数;
  })
  .catch(function (error) {
    // console.log(error);
  });
function getmyalbum(){
    axios({
        url: '/api/getuseralbumname',
        method: 'get',
        params:{
            id:userid,
            size:10,
            begin:1
        }
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            let allarr=data.data.msg.list;
            albumbody.innerHTML=``;
            for(let i in allarr){
                // console.log(allarr[i]);
                let arrimg=allarr[i].images;
                if(allarr[i].album.status==0||allarr[i].album.status==2){
                    return
                }
                if(JSON.stringify(arrimg)=="{}"){
                    albumbody.innerHTML+=`
                    <a href="album?id=${allarr[i].album.id}" class="Aalbummax">
                        <span class="albumid">${allarr[i].album.id}</span>
                        <div class="imgbox">
                        <div class="img" style="background-image:url(/public/img/kongalbum.png);"></div>
                        </div>
                        <div class="albumtext">
                            <div class="albumname">${allarr[i].album.a_name}</div>
                            <div class="albumnumber">
                                <span>0</span> 图片 | <span>0</span> 收藏
                            </div>
                        </div>
                    </a>
                    `;
                    myalbumbox.innerHTML+=`
                    <a href="album?id=${allarr[i].album.id}" class="myalbuma">
                        <img src="/public/img/kongalbum.png" alt="">
                        <span>${allarr[i].album.a_name}</span>
                        <div>0  图片</div>
                    </a>
                    `;
                    continue
                }
                // console.log(arrimg);
                let allimg=``;
                let thisimg;
                let imgnumber=0;
                let conimg=``;
                for(let key in arrimg){
                     thisimg=arrimg[key];
                     imgnumber+=arrimg[key].length;
                }
                
                let imglength=thisimg.length;
                if(imglength==1){
                    allimg=`
                        <div class="img" style="background-image:url(${thisimg[0].img_url});"></div>
                    `
                    conimg=`<img src="${thisimg[0].img_url}" alt="">`
                }else if(imglength==0){
                    allimg=`
                        <div class="img" style="background-image:url(public/img/userHead.jpg);"></div>
                    `
                    conimg=`<img src="/public/img/kongalbum.png" alt="">`
                }
                else{
                    allimg=`
                    <div class="img2" style="background-image:url(${thisimg[0].img_url});"></div>
                    <div class="img2" style="background-image:url(${thisimg[1].img_url});"></div>
                `
                conimg=`<img src="${thisimg[0].img_url}" alt="">`
                }
                albumbody.innerHTML+=`
                <a href="album?id=${allarr[i].album.id}" class="Aalbummax">
                    <span class="albumid">${allarr[i].album.id}</span>
                    <div class="imgbox">
                        ${allimg}
                    </div>
                    <div class="albumtext">
                        <div class="albumname">${allarr[i].album.a_name}</div>
                        <div class="albumnumber">
                            <span>${imgnumber}</span> 图片 | <span>0</span> 收藏
                        </div>
                    </div>
                </a>
                `;
                myalbumbox.innerHTML+=`
                <a href="album?id=${allarr[i].album.id}" class="myalbuma">
                    ${conimg}
                    <span>${allarr[i].album.a_name}</span>
                    <div>${imgnumber}  图片</div>
                </a>
                `;
            }
        }else{
            // console.log(data.data);
        }
      }).catch(function (error) {
        // console.log(error);
      });
}
function tofollow(){
    axios({
        url: '/api/addfollow',
        method: 'post',
        data:{
            userid:userid
        }
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            if(data.data.msg=='success'){
                followbutton[0].style.display='none'
                followbutton[1].style.display='block'
            }else{
                followbutton[1].style.display='none'
                followbutton[0].style.display='block'
            }
        }else{
            hintFn('wrong' ,data.data.msg)
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
}
function outfollow(){
    axios({
        url: '/api/deletefollow',
        method: 'get',
        params:{
            userid:userid
        }
      }).then(data => {
        // console.log(data.data);
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
        // console.log(error);
      });
}
function inspectfollow(){
    axios({
        url: '/api/inspectfollow',
        method: 'get',
        params:{
            userid:userid
        }
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            if(data.data.msg){
                followbutton[0].style.display='none'
                followbutton[1].style.display='block'
            }else{
                followbutton[1].style.display='none'
                followbutton[0].style.display='block'
            }
        }else{
            // alert("未登录")
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
}
inspectfollow()
function tochat(){
    axios({
        url: '/api/eachfollow',
        method: 'get',
        params:{
            userid:userid
        }
    }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            setTimeout(function () {
                window.location.assign(`/chat?id=${userid}`);
            }, 1000)
        }else{
            hintFn('warning',"俩着相互关注才能发私信！")
        }
    })
    .catch(function (error) {
        // console.log(error);
    });
}
let dynowpage=1;
let dyallpage=1;
function showmydynamic(){
    axios({
      url: '/api/getuserdynamic',
      method: 'get',
      params:{
          size:5,
          begin:dynowpage,
          id:userid
      }
    }).then(data => { 
      if(data.data.err==0){
        if(data.data.msg.all_count==0){
            class_body1.innerHTML+=`
            <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                什么都没有呢 . . .
            </div>
          `
          lookmore.style.display='none';
          lookend.style.display='block';
            return
        }
          dynumber.innerText=data.data.msg.all_count
          dyallpage=data.data.msg.all_page;
          let arr=data.data.msg.list;
          if(data.data.msg.all_count==dynowpage){
              lookmore.style.display='none';
              lookend.style.display='block';
          }else{
            lookmore.style.display='block';
            lookend.style.display='none';
          }
        //   class_body1.innerHTML=``
          for(let i in arr){
              let arrimg='';
              for(let n of arr[i].img_url){
                  arrimg+=`<img src="${n}" alt="">`
              }
              class_body1.innerHTML+=`
              <div class="dynamicmax">
                  <div class="user_cord">
                      <a href="userhomepage?id=${arr[i].user_id}" class="dyusera">
                          <img src="${arr[i].user_img_url}" class="dyuserhead" alt="">
                          <span class="dyusername">${arr[i].user_name}</span>
                          <span class="dyuserid">${arr[i].user_id}</span>
                      </a>
                      <span class="dytime">${contrasttime(arr[i].create_time)}</span>
                  </div>
                  <a href="dynamicDetails?id=${arr[i].img_id}" class="dytexta">
                      <div class="imgde">
                      ${arr[i].describes}
                      </div>
                      <div class="imgmax">
                      ${arrimg}
                      </div>
                  </a>
              </div>
              `
          }
      }else{
          // alert("未登录")
      }
    })
    .catch(function (error) {
    //   console.log(error);
    });
}
let colnowpage=1;
let colallpage=1;
function showmycollect(){
    axios({
      url: '/api/getusercollect',
      method: 'get',
      params:{
          size:5,
          begin:colnowpage,
          id:userid
      }
    }).then(data => { 
        // console.log(data.data);
      if(data.data.err==0){
        if(data.data.msg.all_count==0){
            collect_body.innerHTML+=`
            <div id="emptymeaage" style="padding-top: 150px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                什么都没有呢 . . .
            </div>
          `
          lookmore.style.display='none';
          lookend.style.display='block';
            return
        }
        if(data.data.msg.all_count==colnowpage){
            // lookmore.style.display='none';
            // lookend.style.display='block';
        }else{
          lookmore.style.display='block';
          lookend.style.display='none';
        }
        colallpage=data.data.msg.all_page;
        let arr=data.data.msg.list;
          for(let i in arr){
              let arrimg='';
              for(let n of arr[i].urls){
                  arrimg+=`<img src="${n}" alt="">`
              }
              collect_body.innerHTML+=`
                <div class="colnamicmax">
                    <div class="user_cord">
                        <a href="userhomepage?id=${arr[i].users.id}" class="dyusera">
                            <img src="${arr[i].users.img_url}" class="dyuserhead" alt="">
                            <span class="dyusername">${arr[i].users.name}</span>
                        </a>
                        <span class="dytime">${contrasttime(arr[i].images.create_time)}</span>
                    </div>
                    <a href="album?id=${arr[i].album.id}" class="abmax">
                        来自专辑 <span>${arr[i].album.a_name}</span> 的动态：
                    </a>
                    <a href="dynamicDetails?id=${arr[i].images.id}" class="dytexta">
                        <div class="imgde">${arr[i].images.describes}</div>
                        <div class="imgmax">${arrimg}</div>
                    </a>
                </div>
              `
          }
      }else{
          // alert("未登录")
      }
    })
    .catch(function (error) {
    //   console.log(error);
    });
}
getmyalbum()
showmycollect()
showmydynamic()
function onlandmore(){
    if(dyshow){
        if(dyallpage>dynowpage){
            dynowpage++;
            setTimeout(function(){showmydynamic()},500)
        }else{
            setTimeout(function(){
                lookmore.style.display='none';
                lookend.style.display='block';
            },600)
        }
    }else if(colshow){
        if(colallpage>colnowpage){
            colnowpage++;
            setTimeout(function(){showmycollect()},500)
        }else{
            setTimeout(function(){
                lookmore.style.display='none';
                lookend.style.display='block';
            },600) 
        }
    }
}
window.onscroll = function () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    let that = this;
    if (scrollHeight-1<= scrollTop + windowHeight) {
        delay(onlandmore,1000)
    }
};