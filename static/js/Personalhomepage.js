let textmessage=document.getElementsByClassName('textmessage');
let conli=document.getElementsByClassName('conli');
let cordimg=document.getElementById('cordimg')
let seximg=document.getElementsByClassName('seximg')
let cord_contentHead=document.getElementById('cord-contentHead')
let useremail=document.getElementsByClassName('useremail')
let mynumber=document.getElementsByClassName('mynumber')
let class_body1=document.getElementsByClassName('class_body')[0]
let class_body2=document.getElementsByClassName('albumbody')[0];
let album=document.getElementById('album')
let album_input=document.getElementsByClassName('album_input');
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
        if(me.img_url!=null){
            cordimg.style.backgroundImage=`url(${me.img_url})`;
        }
        cord_contentHead.innerHTML=me.name;
        useremail[0].innerHTML=me.mail;
        if(me.sex!="男"){
            seximg.src=`url(/public/img/woman.png)`;
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
  function showmydynamic(){
      axios({
        url: '/api/getmydynamic',
        method: 'get',
        params:{
            size:10,
            begin:0
        }
      }).then(data => {
        if(data.data.err==0){
            let arr=data.data.msg.records;
            class_body1.innerHTML=``
            for(let i in arr){
                let arrimg='';
                for(let n of arr[i].img_url){
                    arrimg+=`<img src="${n}" alt="">`
                }
                class_body1.innerHTML+=`
                <div class="dynamicmax">
                    <div class="user_cord">
                        <a href="" class="dyusera">
                            <img src="${arr[i].user_img_url}" class="dyuserhead" alt="">
                            <span class="dyusername">${arr[i].user_name}</span>
                            <span class="dyuserid">${arr[i].user_id}</span>
                        </a>
                        <span class="dytime">${arr[i].create_time}</span>
                    </div>
                    <a href="" class="dytexta">
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
function getmyalbum(){
    axios({
        url: '/api/getmyalbumname',
        method: 'get',
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            let allarr=data.data.msg;
            class_body2.innerHTML=``;
            for(let i in allarr){
                let arrimg=allarr[i].images;
                // console.log(arrimg);
                if(JSON.stringify(arrimg)=="{}"){
                    class_body2.innerHTML+=`
                    <a href="javascript:;" class="Aalbummax">
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
                    return 
                }
                // console.log(arrimg);
                let allimg=``;
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
                }else{
                    allimg=`
                    <div class="img2" style="background-image:url(${thisimg[0].img_url});"></div>
                    <div class="img2" style="background-image:url(${thisimg[1].img_url});"></div>
                `
                }
                class_body2.innerHTML+=`
                <a href="" class="Aalbummax">
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
            }
        }else{

        }
      }).catch(function (error) {
        
      });
}
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
    axios({
        url: '/api/addalbum',
        method: 'post',
        data:{
            album:album_input[0].value,
            types:album_input[1].value,
            describes:album_input[2].value
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
        console.log(error);
      });
}