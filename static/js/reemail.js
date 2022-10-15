let mypassword=document.getElementById('mypassword');
let mymessage=document.getElementsByClassName('mymessage');
function checkpassword(){
    if(isnull(mypassword.value)){
        hintFn('warning' ,"请输入密码!")
        return 
    }
    axios({
        url: '/api/checkaccount',
        method: 'get',
        params:{
            password:mypassword.value
        }
      }).then(data => {
        // console.log(data.data);
        if(data.data.err==0){   
            hintFn('success' ,"验证成功！")
            // sessionStorage.setItem('havecheck', 1);
            mymessage[0].style.display='none';
            mymessage[1].style.display='block';
        }else{
            hintFn('wrong' ,data.data.msg)
        }
      })
      .catch(function (error) {
        hintFn('wrong' ,"失败")
      });
}
let mymail=document.getElementById('mymail')
let getcodea=document.getElementById('getcodea')
let mycode=document.getElementById('mycode')
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
        hintFn('warning' ,'请输入您要修改的邮箱')
        return
    }else{
        axios({
            url: '/api/sendcode',
            method: 'post',
            data: {
              "mail": mail,
            }
          }).then(data => {
            console.log(data.data);
            if(data.data.err==0){
                hintFn('success' ,'发送成功')
                opendjs()
            }else{
                hintFn('warning' ,data.data.msg)
            }
          }).catch(function (error) {
            
          });
    }
}
function checkcode(){
    return new Promise((resolve,reject)=>{
        let mail=mymail.value;
        let code=mycode.value;
        if(isnull(mail)){
            reject('请输入您要修改的邮箱');
        }else if(isnull(code)){
            reject('请输入验证码');
        }else{
            axios({
                url: '/api/checkcode',
                method: 'post',
                data: {
                  "mail": mail,
                  'code':code
                }
              }).then(data => {
                console.log(data.data);
                if(data.data.err==0){
                    resolve(mail)
                }else{
                    reject(data.data.msg);
                }
              })
        }
    
    }).then(data2=>{
        axios({
            url: '/api/remyemail',
            method: 'post',
            data: {
              "email": data2,
            }
          }).then(data => {
            if(data.data.err==0){
                hintFn('success','修改成功')
                setTimeout(function () {
                    window.location.assign("/Personalhomepage");
                }, 1500)
            }else{
                reject(data.data.msg);
            }
          })
      })
      .catch(function (error) {
        hintFn('wrong' ,"验证失败！")
      });
}
