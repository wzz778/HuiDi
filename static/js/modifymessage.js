let cordimg=document.getElementById('cordimg')
let headfile=document.getElementById('headfile')
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
    reader.readAsDataURL(headfile.files[0]);
    reader.onload=function(e){
        cordimg.style.backgroundImage=`url(${this.result})`;
    }
}  
