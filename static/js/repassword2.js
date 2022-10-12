window.onload = function() {
	createCode();
}
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
  }
let mymail=document.getElementById('mymail');
let password=document.getElementById('password');
let repassword=document.getElementById('repassword');
function createCode() {
	code = "";
	var codeLength = 4; //验证码的长度   
	var checkCode = document.getElementById("checkCode");
	var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
		'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数   
	for(var i = 0; i < codeLength; i++) { //循环操作   
		var charIndex = Math.floor(Math.random() * 36); //取得随机数的索引   
		code += random[charIndex]; //根据索引取得随机数加到code上   
	}
	checkCode.value = code; //把code值赋给验证码   
}
//校验验证码   
function validate() {
	var inputCode = document.getElementById("input").value.toUpperCase(); //取得输入的验证码并转化为大写         
	if(inputCode.length <= 0) { //若输入的验证码长度为0   
		hintFn('warning' ,"请输入验证码！")
		 //则弹出请输入验证码   
		return
	} else if(inputCode != code) { //若输入的验证码与产生的验证码不一致时 
		hintFn('warning' ,"验证码输入错误！")  
		 //则弹出验证码输入错误   
		createCode(); //刷新验证码   
		return
	} 
	let pa=password.value;
	let repa=repassword.value;
	var passLimit=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
	if(isnull(pa)||isnull(repa)){
		hintFn('warning' ,"请填写完整内容")
		
		return 
	}
	if(passLimit.test(pa)==false){
		hintFn('warning' ,"请输入6~12位英文,数字字符的密码")
		return 
	}
	if(pa!=repa){
		hintFn('warning' ,"您输入的两次密码不一致")
		return 
	}else{
		axios({
            url: 'api/updatepassword',
            method: 'POST',
            data: {
              "email":mymail.innerHTML,
			  "newPassword":pa,
            }
          }).then(data => {
            console.log(data.data);
            if(data.data.err==0){
				hintFn('success' ,'修改成功')
				sessionStorage.removeItem('mymail');
				setTimeout(function () {
					window.location.assign("/login");
				}, 300)
            }else{
				hintFn('warning' ,data.data.msg)
            }
          }).catch(function (error) {
            
          });
	}
}
if( sessionStorage.getItem('mymail')){
	mymail.innerHTML=sessionStorage.getItem('mymail');
}else{
	hintFn('warning' ,'请先验证您的邮箱')
	setTimeout(function () {
		window.location.assign("/register");
	}, 300)
}