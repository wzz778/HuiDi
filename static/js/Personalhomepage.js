defaultImgUrl='/public/img/userHead.jpg'
let textmessage=document.getElementsByClassName('textmessage');
let conli=document.getElementsByClassName('conli');
let cordimg=document.getElementById('cordimg')
let seximg=document.getElementsByClassName('seximg')[0]
let cord_contentHead=document.getElementById('cord-contentHead')
let useremail=document.getElementsByClassName('useremail')
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
let album_text=document.getElementsByClassName('album_text')[0]
function changeclass(i){
    conli[i].classList.add('havebethis');
    textmessage[i].style.display='block';
    for(let n=0;n<4;n++){
        if(n!=i){
            conli[n].classList.remove('havebethis');
            textmessage[n].style.display='none';
        };
    };
}
axios({
    url: '/api/getmymessage',
    method: 'get',
  }).then(data => {
    console.log(data.data);
    if(data.data.err==0){
        let me=data.data.msg;
        mydetext.innerHTML=me.describes;
        if(me.img_url!=null){
            cordimg.style.backgroundImage=`url(${me.img_url})`;
        }
        if(me.background!=null){
            mymessageback.style.backgroundImage=`url(${me.background})`;
        }
        cord_contentHead.innerHTML=me.name;
        useremail[0].innerHTML=me.mail;
        if(me.sex!="男"){
            seximg.src=`/public/img/woman.png`;
        }
        return axios({url: '/api/getmynumber',method: 'get',})
    }else{
        // alert("未登录")
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
        console.log(data.data);
        if(data.data.err==0){
            let allarr=data.data.msg.list;
            class_body2.innerHTML=``;
            myalbumbox.innerHTML=``;
            for(let i in allarr){
                let arrimg=allarr[i].images;
                // console.log(arrimg);
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
        if(isnull(i.value)){
            alert("请填写完整内容！");
            return 
        }
    }
    if(album_input[1].value.length>8){
        alert("请填写8个字符一下的专辑名称！");
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
        console.log(data.data);
        if(data.data.err==0){   
            alert("添加成功！");
            getmyalbum()
        }else{
            return 
        }
      })
      .catch(function (error) {
        alert(error);
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
      console.log(data.data);
      if(data.data.err==0){
          let arr=data.data.msg.list;
          dynumber.innerText=data.data.msg.all_count
          dyallpage=data.data.msg.all_page;
        //   class_body1.innerHTML=``
          for(let i in arr){
              let arrimg='';
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
                      <span class="dytime">${arr[i].create_time}</span>
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
      console.log(error);
    });
}
showmydynamic()
window.onscroll = function () {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    let that = this;
    if (scrollHeight <= scrollTop + windowHeight) {
        if(dyallpage>dynowpage){
            dynowpage++;
            lookmore.style.display='block';
            lookend.style.display='none';
            setTimeout(function(){showmydynamic()},1500)
            // showmydynamic()
        }else{
            lookmore.style.display='none';
            lookend.style.display='block';
        }
    }
};
album_text.onkeyup=function(){
    var len = album_text.value.length;
    if(len > 99){
        album_text.value.substring(0,100);
    }
    var num = len;
    abdenumber.innerText=num;
};
album_text.onkeydown=function(){
  var len = album_text.value.length;
  if(len > 99){
    album_text.value=album_text.value.substring(0,100);
  }
  var num = len;
  abdenumber.innerText=num;
};