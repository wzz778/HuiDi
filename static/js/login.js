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
  //
function tologin(){
    let mail=mymail.value;
    let pa=password.value;
    if(isnull(pa)||isnull(mail)){
    hintFn('warning' ,'请填写完整内容')
		// alert("请填写完整内容")
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
          if(data.data.msg.status==1){
              if(Date.parse(new Date()) > Date.parse(data.data.msg.end_time)){
                axios({
                  url: '/api/remystatus',
                  method: 'post',
                  data:newfile
                })
                hintFn('success' ,'登录成功')
                let newfile=new FormData();
                newfile.append("status",0)
                if(data.data.msg.power==2){
                  setTimeout(function () {
                      window.location.assign("/");
                  }, 1000)
                }else{
                  setTimeout(function () {
                    window.location.assign("/homepage");
                }, 1000)}
              }else{
                hintFn('wrong' ,'你登录的账号处于封号状态！');
                axios({
                  url: '/api/outlogin',
                  method: 'get',
                })
              }
          }else{
            hintFn('success' ,'登录成功')
              if(data.data.msg.power==2){
                setTimeout(function () {
                    window.location.assign("/");
                }, 1000)
              }else{
                setTimeout(function () {
                  window.location.assign("/homepage");
              }, 1000)
          }
        }
        }else{
            alert(data.data.msg);
        }
      }).catch(function (error) {
        
      });
}
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function() {         // 监听回退按钮
  alert('-----------')
  // history.back()
},false);
