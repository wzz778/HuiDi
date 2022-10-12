let cordimg=document.getElementById('cordimg')
let headfile=document.getElementById('headfile')
let mymessageback=document.getElementById('mymessageback')
let sexinput=document.getElementsByName('sex')
let kuanginput=document.getElementsByClassName('kuanginput')[0]
let describe=document.getElementsByClassName('describe')[0]
let backfile=document.getElementById('backfile')
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
        if(me.background!=null){
            mymessageback.style.backgroundImage=`url(${me.background})`;
        }
        kuanginput.value=me.name;
        describe.value=me.describes;
        denumber.innerText=me.describes.length;
        // useremail[0].innerHTML=me.mail;
        if(me.sex=="男"){
            sexinput[0].checked=true;
        }else{
            sexinput[1].checked=true;
        }
    }else{
        hintFn('wrong' ,"未登录")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
function openimg(){
    var reader= new FileReader();
    if(!checkFile(headfile.files[0])){
        hintFn('warning' ,'请上传图片类型的头像！')
        return 
    }
    reader.readAsDataURL(headfile.files[0]);
    reader.onload=function(e){
        cordimg.style.backgroundImage=`url(${this.result})`;
    }
}  
function openbackimg(){
    var reader= new FileReader();
    if(!checkFile(backfile.files[0])){
        hintFn('warning' ,'请上传图片类型的背景！')
        return 
    }
    reader.readAsDataURL(backfile.files[0]);
    reader.onload=function(e){
        mymessageback.style.backgroundImage=`url(${this.result})`;
    }
}  
function keepmessage(){
    let newfile=new FormData();
    if(isnull(kuanginput.value)&&isnull(describe.value)){
        hintFn('warning' ,"请输入完整内容")
        return
    }
    if(judgeStr(kuanginput.value).length>6){
        hintFn('warning' ,"请输入6个字符以内的用户名！")
        return
    }
    let sex=sexinput[0].checked?'男':"女";
    newfile.append("username",judgeStr(kuanginput.value))
    newfile.append("describes",judgeStr(describe.value))
    newfile.append("sex",sex)
    if(headfile.files[0]!=undefined){
        newfile.append("file",headfile.files[0])
    }
    if(backfile.files[0]!=undefined){
        newfile.append("background_img",backfile.files[0])
    }
    axios({
        method: 'POST',
        url: '/api/remymessage',
        data:newfile,
    })
    .then((result) => {
        console.log(result.data);
        if(result.data.err==0&&result.data.msg.msg=='OK'){  
            hintFn('success' ,'保存成功')
            setTimeout(function () {
                window.location.assign("/Personalhomepage");
            }, 1000)
        }else{
            hintFn('wrong' ,"保存失败！")
        }
    })
    .catch((err)=>{
        // console.log(err)
    })
}
let denumber=document.getElementById('denumber');
describe.onkeyup=function(){
      var len = describe.value.length;
      if(len > 99){
        describe.value.substring(0,100);
      }
      var num = len;
    denumber.innerText=num;
};
describe.onkeydown=function(){
    var len = describe.value.length;
    if(len > 99){
      describe.value=describe.value.substring(0,100);
    }
    var num = len;
      denumber.innerText=num;
};