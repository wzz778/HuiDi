let header=document.getElementById('header');
let toland=document.getElementById('toland');
let header_headdiv=document.getElementById('header_headdiv');
let headerimg=header_headdiv.getElementsByTagName('img')[0];
let headera=header_headdiv.getElementsByTagName('a')[0];
let header_button=document.getElementsByClassName('header_button')[0];
let header_button_i=header_button.getElementsByTagName('i')[0];
let header_class=document.getElementsByClassName('header_class')[0];
let header_co=document.getElementsByClassName('header_co')[0];
var publish = document.getElementById("publish");
var publish_send = document.getElementsByClassName("publish_send")[0];
var publish_text = document.getElementsByClassName("publish_text")[0];
let select=document.getElementsByClassName('albumselect')[0];
let mymessagedian=document.getElementById('mymessagedian')
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
  }
header_button.onmousemove = function() {
    header_class.style.display='block';
    header_button_i.classList.add("arrowtora");
    header_button_i.style.transform = ("rotate(-180deg)");
}   
header_button.onmouseout = function() {
    header_class.style.display='none';
    header_button_i.classList.remove("arrowtora");
    header_button_i.style.transform = ("rotate(0deg)");
}
header_class.onmousemove = function() {
    header_class.style.display='block';
    header_button_i.classList.add("arrowtora");
    header_button_i.style.transform = ("rotate(-180deg)");
}
header_class.onmouseout = function() {
    header_class.style.display='none';
    header_button_i.classList.remove("arrowtora");
    header_button_i.style.transform = ("rotate(0deg)");
}
header_headdiv.onmousemove = function() {
    header_co.style.display='block';
}  
header_co.onmousemove = function() {
    header_co.style.display='block';
}  
header_headdiv.onmouseout = function() {
    header_co.style.display='none';
}  
header_co.onmouseout = function() {
    header_co.style.display='none';
}  
function Topfun() {
    four = setInterval(FourscrollBy, 8);
}
function FourscrollBy() {
    if (document.documentElement && document.documentElement.scrollTop) {
        if (document.documentElement.scrollTop <= 0) {
            clearInterval(four);
        } else {
            window.scrollBy(0, -30);
        }
    } else {
        if (document.body.scrollTop <= 0) {
            clearInterval(four);
        } else {
            window.scrollBy(0, -30);
        }
    }
}
function publish_down() {
    publish.style.display = "none";
    publish.style.opacity = "0";
    publish.classList.remove("fade");
    // publish_send.value = null;
    // publish_text.value = null;
}
function publish_show() {
    getoption()
    publish.style.display = "block";
    publish.style.opacity = "1";
    publish.classList.add("fade");
}
axios({
    url: '/api/getmymessage',
    method: 'get',
  }).then(data => {
    // console.log(data.data);
    if(data.data.err==0){
        let me=data.data.msg;
        if(me.img_url!=null){
            headerimg.src=me.img_url;
        }
        headera.innerHTML=me.name;
        header_headdiv.style.display='flex'
        toland.style.display='none'
        
    }else{
        header_headdiv.style.display='none'
        toland.style.display='block'
        
    }
  }).catch(function (error) {
    
  });
  //观看是否有消息
  axios({
    url: '/api/getUserIsMessage',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        if(data.data.msg){
            mymessagedian.style.display='block'
        }
    }
  }).catch(function (error) {
    
  });
//多张
// window.onload=function(){
var input=document.getElementById("uploadfile");
var div;
var allfileList=new FormData();
// 当用户上传时触发事件
input.onchange=function(){
    readFile(this);
}
//处理图片并添加都dom中的函数
let sortnum=0;
var readFile=function(obj){
    // 获取input里面的文件组
    fileList=obj.files;
    //对文件组进行遍历，可以到控制台打印出fileList去看看
    for(var i=0;i<fileList.length;i++){
        var reader= new FileReader();
        reader.readAsDataURL(fileList[i]);
        // 当文件读取成功时执行的函数
        let thisfile=fileList[i]
        reader.onload=function(e){
            allfileList.append(`file${sortnum}`,thisfile)
            div=document.createElement('div');
            div.innerHTML=`<span style='display:none;'>${sortnum++}</span><div class="deletediv" onclick='opendetele(this)'>删除</div><img src="${this.result}" />`;
            document.getElementById("img-box").appendChild(div);
        }
    }
    // console.log(fileList);
}
function look(){
    // console.log(document.getElementById("img-box").childNodes);
    let option=select.getElementsByTagName('option');
    let al_id=0;
    for(let i in option){
        if(option[i].selected){
            al_id=option[i].value;
        }
    }
    // let formData = new FormData();  
    // let i=0;
    allfileList.append('al_id', al_id)
    allfileList.append('describes',publish_text.value)
    console.log(Array.from(allfileList));
    if(Array.from(allfileList).length<3){
        alert('请选择你要上传的图片！')
        allfileList.delete('al_id')
        allfileList.delete('describes')
        return
    }
    if(isnull(publish_text.value)){
        alert('请填写你对图片的描述！')
        allfileList.delete('al_id')
        allfileList.delete('describes')
        return
    }
    axios({
        method: 'POST',
        url: '/api/Releasedynamics',
        data: allfileList,
    })
    .then((result) => {
        // console.log(result.data);
        if(result.data.err==0&&result.data.msg.msg=='OK'){
            alert("上传成功！")
            setTimeout(function () {
                window.location.assign("/Personalhomepage");
            }, 500)
        }else{
            alert("上传失败！")
        }
    })
    .catch((err)=>{
        // console.log(err)
    })
    allfileList.delete('al_id')
    allfileList.delete('describes')
}
function opendetele(event){
    let thishtml=event.parentElement;
    let thisn=event.parentElement.getElementsByTagName('span')[0].innerHTML;
    allfileList.delete(`file${thisn}`);
    document.getElementById("img-box").removeChild(thishtml);
}
function getoption(){
    axios({
        url: '/api/getmyalbumname',
        method: 'get',
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){
            let msg=data.data.msg;
            select.innerHTML=``
            for(let i of msg){
                select.innerHTML+=`<option value=${i.album.id}>${i.album.a_name}</option>`
            }
        }else{

        }
      }).catch(function (error) {
        
      });
}
function outlogin(){
    axios({
        url: '/api/outlogin',
        method: 'get',
      }).then(data => {
        if(data.data.err==0){
            alert('退出成功');
            window.location.assign("/login");
        }else{
            alert('退出失败')
        }
      }).catch(function (error) {
        alert('退出失败')
      });
}
