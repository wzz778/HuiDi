defaultImgUrl='/public/img/userHead.jpg'
let textmessage=document.getElementsByClassName('textmessage');
let conli=document.getElementsByClassName('conli');
let cordimg=document.getElementById('cordimg')
let seximg=document.getElementsByClassName('seximg')[0]
let cord_contentHead=document.getElementById('cord-contentHead')
// let useremail=document.getElementsByClassName('useremail')
let mynumber=document.getElementsByClassName('mynumber')
let class_body1=document.getElementsByClassName('class_body')[0]
let class_body2=document.getElementsByClassName('albumbody')[0];
let album=document.getElementById('album')
let dynumber=document.getElementById('dynumber')
let album_input=document.getElementsByClassName('album_input');
let mymessageback=document.getElementById('mymessageback')
let lookmore=document.getElementById('lookmore');
let lookend=document.getElementById('lookend');
let myalbumbox=document.getElementsByClassName('myalbumbox')[0];
let mydetext=document.getElementById('mydetext')
let abdenumber=document.getElementById('abdenumber')
let album_text=document.getElementsByClassName('album_text')[0];
let collect_body=document.getElementsByClassName('class_body')[2]
let dyshow=true;
let colshow=false;
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
function onpass(){
    hintFn('warning' ,"您要观看的文章还没通过审核！")
}
axios({
    url: '/api/getmymessage',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        let me=data.data.msg;
        mydetext.innerHTML=me.describes;
        if(me.img_url!=null){
            cordimg.style.backgroundImage=`url(${me.img_url})`;
        }
        if(me.background!=null){
            mymessageback.style.backgroundImage=`url(${me.background})`;
        }
        if(me.certification!=null){
            cord_contentHead.innerHTML=`${me.name}<span style="padding-left:25px;font-size: 16px;color:#b87100;"><i><img src="/public/iconfont/authentication.png" alt=""></i>认证领域：<span style="color:#669ddf;">${me.certification}</span></span>`;
        }else{
            cord_contentHead.innerHTML=me.name;
        }
        if(me.sex!="男"){
            seximg.src=`/public/img/woman.png`;
        }
        return axios({url: '/api/getmynumber',method: 'get',})
    }else{
        return 
    }
  }).then(data1 => {
    let number=data1.data.msg;
    mynumber[0].innerHTML=number.关注数;
    mynumber[1].innerHTML=number.粉丝数;
  })
  .catch(function (error) {
    console.log(error);
  });
function getmyalbum(){
    axios({
        url: '/api/getmyalbumname',
        method: 'get',
        params:{
            size:10,
            begin:1
        },
      }).then(data => {
        if(data.data.err==0){
            let allarr=data.data.msg.list;
            class_body2.innerHTML=``;
            myalbumbox.innerHTML=``;
            for(let i in allarr){
                let arrimg=allarr[i].images;
                // console.log(arrimg);
                let albumstatusdiv=``
                if(allarr[i].album.status==0){
                    albumstatusdiv=`<div class="albumstatus" style="color:#444;">审核中</div>`
                }else if(allarr[i].album.status==2){
                    albumstatusdiv=`<div class="albumstatus" style="color:#FC1944;">审核未通过</div>`
                }else{
                    albumstatusdiv=`<div class="albumstatus" style="color:#056DE8;">审核通过</div>`
                }
                if(JSON.stringify(arrimg)=="{}"){
                    class_body2.innerHTML+=`
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
                            ${albumstatusdiv}
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
                let conimg=``;
                let thisimg;
                let imgnumber=0;
                for(let key in arrimg){
                     thisimg=arrimg[key];
                     imgnumber+=arrimg[key].length;
                }
                // console.log(thisimg);
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
                    conimg=`
                        <img src="/public/img/kongalbum.png" alt="">
                    `
                }else{
                    allimg=`
                    <div class="img2" style="background-image:url(${thisimg[0].img_url});"></div>
                    <div class="img2" style="background-image:url(${thisimg[1].img_url});"></div>
                `
                conimg=`<img src="${thisimg[0].img_url}" alt="">`
                }
                class_body2.innerHTML+=`
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
                        ${albumstatusdiv}
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

        }
      }).catch(function (error) {
        
      });
}
getmyalbum()
function album_down() {
    album.style.display = "none";
    album.style.opacity = "0";
    album.classList.remove("fade");
    for(let i of album_input){
        i.value=""
    }
}
function album_show() {
    // getoption()
    album.style.display = "block";
    album.style.opacity = "1";
    album.classList.add("fade");
}
function addab(){
    for(let i of album_input){
        if(isnull(judgeStr(i.value))){
            hintFn('warning' ,"请填写完整内容！")
            return 
        }
    }
    if(album_input[1].value.length>8){
        hintFn('warning' ,"请填写8个字符一下的专辑名称！")
        return 
    }
    axios({
        url: '/api/addalbum',
        method: 'post',
        data:{
            album:judgeStr(album_input[0].value),
            types:judgeStr(album_input[1].value),
            describes:judgeStr(album_input[2].value)
        }
      }).then(data => {
        if(data.data.err==0){   
            aname.value=''
            hintFn('success' ,"添加成功！")
            getmyalbum()
        }else{
            if(data.data.msg.msg=="插入重复数据"){
                hintFn('warning' ,"请莫添加相同名的专辑！")
                return
            }
            hintFn('warning' ,"添加失败")
        }
      })
      .catch(function (error) {
        hintFn('warning' ,error)
        console.log(error);
      });
}
let dynowpage=1;
let dyallpage=1;
function showmydynamic(){
    axios({
      url: '/api/getmydynamic',
      method: 'get',
      params:{
          size:5,
          begin:dynowpage
      }
    }).then(data => {
        if(data.data.err==0){
          if(data.data.msg.all_count==dynowpage){
              lookmore.style.display='none';
              lookend.style.display='block';
          }else{
            lookmore.style.display='block';
            lookend.style.display='none';
          }
          let arr=data.data.msg.list;
          dynumber.innerText=data.data.msg.all_count
          dyallpage=data.data.msg.all_page;
        //   class_body1.innerHTML=``
          for(let i in arr){
              let arrimg='';
              let imgstatus='';
              let imga="";
              if(arr[i].status==1){
                imgstatus=`<span class="dystatus" style="color:#056DE8;">审核通过</span>`;
                imga=`<a href="dynamicDetails?id=${arr[i].img_id}" class="dytexta">`
              }else if(arr[i].status==0){
                imgstatus=`<span class="dystatus" style="color:#444;">审核中</span>`;
                imga=`<a href="javascript:;" onclick="onpass()" class="dytexta">`
              }else{
                imgstatus=`<span class="dystatus" style="color:#FC1944;;">审核未通过</span>`;
                imga=`<a href="javascript:;" onclick="onpass()" class="dytexta">`
              }
              for(let n of arr[i].img_url){
                  arrimg+=`<img src="${defaultImgUrl}" alt="" data-url="${n}" onload="operatorImgFn(this)">`
              }
              class_body1.innerHTML+=`
              <div class="dynamicmax">
                  <div class="user_cord">
                      <a href="" class="dyusera">
                          <img src="${defaultImgUrl}" alt="" class="dyuserhead" data-url="${arr[i].user_img_url}" onload="operatorImgFn(this)">
                          <span class="dyusername">${arr[i].user_name}</span>
                          <span class="dyuserid">${arr[i].user_id}</span>
                      </a>
                      <span class="dytime">${contrasttime(arr[i].create_time)}</span>
                      ${imgstatus}
                  </div>
                    ${imga}
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
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
let colnowpage=1;
let colallpage=1;
function showmycollect(){
    axios({
      url: '/api/getmycollect',
      method: 'get',
      params:{
          size:5,
          begin:colnowpage,
      }
    }).then(data => { 
        // console.log(data.data);
      if(data.data.err==0){
        if(data.data.msg.all_count==dynowpage){
            lookmore.style.display='none';
            lookend.style.display='block';
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
                    <a href="dynamicDetails?id=${arr[i].images.al_id}" class="dytexta">
                        <div class="imgde">${arr[i].images.describes}</div>
                        <div class="imgmax">${arrimg}</div>
                    </a>
                </div>
              `
          }
      }else{
        
      }
    })
    .catch(function (error) {
      console.log(error);
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
album_text.onkeyup=function(){
    var len = album_text.value.length;
    if(len > 99){
        album_text.value.substring(0,99);
    }
    var num = len;
    abdenumber.innerText=num;
};
album_text.onkeydown=function(){
  var len = album_text.value.length;
  if(len > 99){
    album_text.value=album_text.value.substring(0,99);
  }
  var num = len;
  abdenumber.innerText=num;
};