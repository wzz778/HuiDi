let header=document.getElementById('header');
let toland=document.getElementById('toland');
let header_headdiv=document.getElementById('header_headdiv');
// let headerimg=header_headdiv.getElementsByTagName('img')[0];
let headerimg=header_headdiv.getElementsByClassName('img')[0];
let headera=header_headdiv.getElementsByTagName('a')[0];
let header_button=document.getElementsByClassName('header_button')[0];
let header_button_i=header_button.getElementsByTagName('i')[0];
let header_class=document.getElementsByClassName('header_class')[0];
let search_class=document.getElementsByClassName('search_class')[0];
let header_co=document.getElementsByClassName('header_co')[0];
var publish = document.getElementById("publish");
var publish_send = document.getElementsByClassName("publish_send")[0];
var publish_text = document.getElementsByClassName("publish_text")[0];
let select=document.getElementsByClassName('albumselect')[0];
let mymessagedian=document.getElementById('mymessagedian')
let searchinput=document.getElementById('searchinput')
let dydenumber=document.getElementById('dydenumber')
let dyde=document.getElementById('dyde')
let searchva=document.getElementsByClassName('searchva');
let onlandmax=document.getElementById('onlandmax')
function contrasttime(time){
    let data=new Date(time.replace(/-/g,"/"));
    let t1=new Date();//获取当前时间
    let times=t1.getTime()-data.getTime();//时间差的毫秒数
    let days=parseInt(times/(24*1000*3600));//计算相差的天数
    if(days>0){
        if(days<2){
            return `${days}天前`
        }else{
            return time;
        }
    }
    let leave=times%(24*3600*1000);//计算天数后剩余的毫秒数
    let h=parseInt(leave/(3600*1000));//计算小时数
    if(h>0){
        return `${h}小时前`
    }
     //计算分钟数
    let h_leave=leave%(3600*1000);
    let min=parseInt(h_leave/(60*1000));//计算秒数
    if(min>0){
        return `${min}分钟前`
    }else{
        return `1分钟前`
    }
}
//检查输入为空
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
}
function judgeStrs(val) {
    // 判断是否是全空格
    // if (str.replace(/(^\s*)|(\s*$)/g, "") == "") {
    //     return false
    // }
    // 将字符串中的标签替换
    var str = val.toString().replace(/(^\s*)|(\s*$)/g, "").replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return str
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
function showsearch(){
    for(let i of searchva){
        i.innerText=searchinput.value
    }
    search_class.style.display='block'
}
function fadesearch(){
    search_class.style.display='none'
}
function Topfun() {
    four = setInterval(FourscrollBy, 2);
}
searchinput.onblur=fadesearch;
search_class.onmousemove = function() {
    searchinput.onblur=null;
}  
search_class.onmouseout= function() {
    searchinput.onblur=fadesearch;
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
            headerimg.style.backgroundImage=`url(${me.img_url})`;
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
  axios({
    url: '/api/getUserIsChat',
    method: 'get',
  }).then(data => {
    console.log(data.data);
    if(data.data.err==0){
        if(data.data.msg){
            mymessagedian.style.display='block'
        }
    }
  }).catch(function (error) {
    
  });
  //检查文件是否是图片
function checkFile(img) {
    let file = img;
    // console.log(file);
    if (file == null || file == "") {
        return false;
    }
    var allow_ext = ".jpg|.png|.gif|.jpeg|";
    var ext_name = file.name.substring(file.name.lastIndexOf("."));
    if (allow_ext.indexOf(ext_name + "|") == -1) {
        successText.innerHTML =  "该文件不允许上传，请上传" + allow_ext + "类型的文件,当前文件类型为：" + ext_name;
        return false;
    }
    return true
}
//多张
// window.onload=function(){
var input=document.getElementById("uploadfile");
var div;
var allfileList=new FormData();//创建队列暂存form文件
// 当用户上传时触发事件
input.onchange=function(){
    readFile(this);
}
//处理图片并添加都dom中的函数
let sortnum=0;//标记文件索引
var readFile=function(obj){
    // 获取input里面的文件组
    fileList=obj.files;
    //对文件组进行遍历，可以到控制台打印出fileList去看看
    for(var i=0;i<fileList.length;i++){
        var reader= new FileReader();
        if(!checkFile(fileList[i])){
            hintFn('warning' ,'请上传图片文件')
            return
        }
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
    let option=select.getElementsByTagName('option');
    let al_id=0;
    for(let i in option){
        if(option[i].selected){
            al_id=option[i].value;
        }
    }
    if(isnull(publish_text.value)){
        hintFn('warning' ,'请填写你对图片的描述！')
        return
    }
    allfileList.append('al_id', al_id)
    allfileList.append('describes',judgeStr(publish_text.value))
    // console.log(Array.from(allfileList));
    if(Array.from(allfileList).length<3){
        hintFn('warning' ,'请选择你要上传的图片！')
        allfileList.delete('al_id')
        allfileList.delete('describes')
        return
    }
    openland()
    axios({
        method: 'POST',
        url: '/api/Releasedynamics',
        data: allfileList,
    })
    .then((result) => {
        // console.log(result.data);
        closeland()
        if(result.data.err==0&&result.data.msg.msg=='OK'){
            hintFn('success' ,"上传成功！")
            setTimeout(function () {
                window.location.assign("/Personalhomepage");
            }, 500)
        }else{
            hintFn('wrong' ,"上传失败！")
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
        if(data.data.err==0){
            let msg=data.data.msg.list;
            select.innerHTML=``
            for(let i of msg){
                select.innerHTML+=`<option value=${i.album.id}>${i.album.a_name}</option>`
            }
        }else{

        }
      }).catch(function (error) {
        
      });
}
getoption()
function outlogin(){
    axios({
        url: '/api/outlogin',
        method: 'get',
      }).then(data => {
        if(data.data.err==0){
            hintFn('success' ,'退出成功')
            window.location.assign("/login");
        }else{
            hintFn('wrong' ,'退出失败')
        }
      }).catch(function (error) {
        hintFn('wrong' ,'退出失败')
      });
}
function tofind(type){
    if(isnull(searchinput.value)){
        fadesearch()
        hintFn('warning' ,'请输入搜索内容！')
        return 
    }
    let thisvalue={
        message:searchinput.value,
        type:type
    }
    let maxle=8;
    if(localStorage.getItem('hdsearch_history')==undefined||localStorage.getItem('hdsearch_history')==''){
        let arr=[]
        arr[0]=thisvalue;
        // console.log(JSON.stringify(arr));
        localStorage.setItem('hdsearch_history',JSON.stringify(arr));
    }else{
        let now=localStorage.getItem('hdsearch_history');
        let nowarr=JSON.parse(now);
        let nowarrlength=nowarr.length;
        for(let i of nowarr){
            if(JSON.stringify(thisvalue)==JSON.stringify(i)){
                window.location.assign(`/search?message=${searchinput.value}&type=${type}`);
                return
            }
        }
        if(nowarrlength<maxle-1){
            nowarr[nowarrlength]=thisvalue
        }else{
            for(let i=0;i<maxle-2;i++){
                nowarr[i]=nowarr[1+i]
            }
            nowarr[maxle-1]=thisvalue
        }
        localStorage.setItem('hdsearch_history',JSON.stringify(nowarr));
    }
    window.location.assign(`/search?message=${searchinput.value}&type=${type}`);
}
axios({
    method: 'GET',
    url: '/api/lookalltype',
})
.then((result) => {
    // console.log(result.data);
    if(result.data.err==0){
        header_class.innerHTML=``;
        for(let i of result.data.msg){
            header_class.innerHTML+=`
                <a href="/Classification?id=${i.type.id}">${i.type.name}</a>
            `;
        }
    }else{
    }
})
.catch((err)=>{
    // console.log(err)
})
dyde.onkeyup=function(){
    var len = dyde.value.length;
    if(len > 99){
        dyde.value.substring(0,100);
    }
    var num = len;
    dydenumber.innerText=num;
};
dyde.onkeydown=function(){
  var len = dyde.value.length;
  if(len > 99){
    dyde.value=dyde.value.substring(0,100);
  }
  var num = len;
  dydenumber.innerText=num;
};
function openland(){
    onlandmax.style.display='block'
}
function closeland(){
    onlandmax.style.display='block'
}