let mymail=document.getElementById('mymail')
let getcodea=document.getElementById('getcodea')
let mycode=document.getElementById('mycode')
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
  }
var times=60;
var djs
function opendjs(){
    djs=setInterval(function(){
        if(times==0){
            times=60;
            clearInterval(djs)
             getcodea.innerHTML=`获取验证码`
             getcodea.style.cursor='pointer';
             getcodea.onclick=getcode;
        }else{
            getcodea.style.cursor='not-allowed';
            getcodea.onclick=function(){return};
            getcodea.innerHTML=`${times--}s后可重新发送`
        }
    },1000);
}
function getcode(){
    let mail=mymail.value;
    if(isnull(mail)){
        hintFn('warning' ,'请输入您要注册的邮箱')
        return
    }else{
        axios({
            url: '/api/sendcode',
            method: 'post',
            data: {
              "mail": mail,
            }
          }).then(data => {
            // console.log(data.data);
            if(data.data.err==0){
                hintFn('success' ,'发送成功')
                opendjs()
            }else{
                hintFn('warning' ,data.data.msg)
            }
          }).catch(function (error) {
            hintFn('warning' ,data.data.msg)
          });
    }
}
function checkcode(){
    let mail=mymail.value;
    let code=mycode.value;
    if(isnull(mail)){
        hintFn('warning' ,'请输入您要注册的邮箱')
        return
    }else if(isnull(code)){
        hintFn('warning' ,'请输入验证码')
        return
    }else{
        axios({
            url: '/api/checkcode',
            method: 'post',
            data: {
              "mail": mail,
              'code':code
            }
          }).then(data => {
            // console.log(data.data);
            if(data.data.err==0){
                hintFn('success' ,'验证成功')
                sessionStorage.setItem('mymail',mail);
                setTimeout(function () {
                    window.location.assign("/register2");
                }, 1500)
            }else{
                hintFn('warning' ,"验证失败")
            }
          }).catch(function (error) {
            hintFn('warning' ,"验证失败")
          });
    }
}