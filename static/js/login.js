let mymail=document.getElementById('mymail');
let password=document.getElementById('password');
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
  }
function tologin(){
    let mail=mymail.value;
    let pa=password.value;
    if(isnull(pa)||isnull(mail)){
		alert("请填写完整内容")
		return 
	}
    axios({
        url: '/api/login',
        method: 'post',
        data: {
          "username": mail,
          "password":pa
        }
      }).then(data => {
        console.log(data.data);
        if(data.data.err==0){
            alert('登录成功');
            setTimeout(function () {
                window.location.assign("/layout");
            }, 300)
        }else{
            alert(data.data.msg);
        }
      }).catch(function (error) {
        
      });
}