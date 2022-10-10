let cordimg=document.getElementById('cordimg')
let headfile=document.getElementById('headfile')
let mymessageback=document.getElementById('mymessageback')
let sexinput=document.getElementsByName('sex')
let kuanginput=document.getElementsByClassName('kuanginput')[0]
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
        if(me.background_img!=null){
            mymessageback.style.backgroundImage=`url(${me.background_img})`;
        }
        kuanginput.value=me.name;
        // useremail[0].innerHTML=me.mail;
        if(me.sex=="男"){
            sexinput[0].checked=true;
        }else{
            sexinput[1].checked=true;
        }
    }else{
        alert("未登录")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
function openimg(){
    var reader= new FileReader();
    if(!checkFile(headfile.files[0])){
        alert('请上传图片类型的头像！');
        return 
    }
    reader.readAsDataURL(headfile.files[0]);
    reader.onload=function(e){
        cordimg.style.backgroundImage=`url(${this.result})`;
    }
}  
function keepmessage(){
    let newfile=new FormData();
    if(isnull(kuanginput.value)){
        alert("请输入完整内容");
        return
    }
    let sex=sexinput[0].checked?'男':"女";
    newfile.append("username",kuanginput.value)
    newfile.append("sex",sex)
    if(headfile.files[0]!=undefined){
        newfile.append("file",headfile.files[0])
    }
    axios({
        method: 'POST',
        url: '/api/remymessage',
        data:newfile,
    })
    .then((result) => {
        console.log(result.data);
        if(result.data.err==0&&result.data.msg.msg=='OK'){  
            alert('保存成功')
            setTimeout(function () {
                window.location.assign("/Personalhomepage");
            }, 300)
        }else{
            alert("保存保存！")
        }
    })
    .catch((err)=>{
        // console.log(err)
    })
}