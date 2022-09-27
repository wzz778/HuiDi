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
    publish.style.display = "block";
    publish.style.opacity = "1";
    publish.classList.add("fade");
}
axios({
    url: '/api/getmymessage',
    method: 'get',
  }).then(data => {
    console.log(data.data);
    if(data.data.err==-1){
        let me=data.data.msg;
        if(me.img_url!=null){
            headerimg.src=me.img_url;
        }
        headera.innerHTML=me.name;
        header_headdiv.style.display='none'
        toland.style.display='block'

    }else{
        header_headdiv.style.display='flex'
        toland.style.display='none'
        
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
var readFile=function(obj){
    // 获取input里面的文件组
    fileList=obj.files;
    for (let i in fileList) {
        allfileList.append(`file${i}`,fileList[i])
        i++;
    }
    //对文件组进行遍历，可以到控制台打印出fileList去看看
    for(var i=0;i<fileList.length;i++){
        var reader= new FileReader();
        reader.readAsDataURL(fileList[i]);
        // 当文件读取成功时执行的函数
        reader.onload=function(e){
            div=document.createElement('div');
            div.innerHTML=`<div class="deletediv" onclick='opendetele(this)'>删除</div><img src="${this.result}" />`;
            document.getElementById("img-box").appendChild(div);
        }
    }
    // console.log(fileList);
}
function look(){
    console.log(document.getElementById("img-box").childNodes);
    // let formData = new FormData();  
    // let i=0;w
    // for (let key in files) {
    //     formData.append(`file${i}`,files[key])
    //     i++;
    // }
    // allfileList.append('application_id', 400)
    // allfileList.append('enclosure_name','name')
    // console.log(formData)
    // axios({
    //     method: 'POST',
    //     url: 'http://127.0.0.1:3000/api/UploadAttachment',
    //     data: allfileList,
    // })
    // .then((result) => {
    //     console.log(result.data);
    // })
    // .catch((err)=>{
    //     // console.log(err)
    // })
}
function opendetele(event){
    let thishtml=event.parentElement;
    // console.log(event.parentElement);
    document.getElementById("img-box").removeChild(thishtml);
}