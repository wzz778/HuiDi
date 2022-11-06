let cordimg=document.getElementById('cordimg')
let headfile=document.getElementById('headfile')
let sexinput=document.getElementsByName('sex')
let kuanginput=document.getElementsByClassName('kuanginput')[0]
let describe=document.getElementsByClassName('describe')[0]
let backfile=document.getElementById('backfile')
let kepepbu=document.getElementById('kepepbu')
let finalImg=document.getElementById('finalImg')
axios({
    url: '/api/getmymessage',
    method: 'get',
  }).then(data => {
    // console.log(data.data);
    if(data.data.err==0){
        let me=data.data.msg;
        if(me.img_url!=null){
            cordimg.style.backgroundImage=`url(${me.img_url})`;
        }
        if(me.background!=null){
            finalImg.src=`${me.background}`;
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
    // console.log(error);
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
let denumber=document.getElementById('denumber');
describe.onkeyup=function(){
      var len = describe.value.length;
      if(len > 99){
        describe.value.substring(0,99);
      }
      var num = len;
    denumber.innerText=num;
};
describe.onkeydown=function(){
    var len = describe.value.length;
    if(len > 99){
      describe.value=describe.value.substring(0,99);
    }
    var num = len;
      denumber.innerText=num;
};
    //弹出框水平垂直居中
    (window.onresize = function () {
        var win_height = $(window).height();
        var win_width = $(window).width();
        if (win_width <= 768){
            $(".tailoring-content").css({
                "top": (win_height - $(".tailoring-content").outerHeight())/2,
                "left": 0
            });
        }else{
            $(".tailoring-content").css({
                "top": (win_height - $(".tailoring-content").outerHeight())/2,
                "left": (win_width - $(".tailoring-content").outerWidth())/2
            });
        }
    })();

    //弹出图片裁剪框
    $("#replaceImg").on("click",function () {
        $(".tailoring-container").toggle();
    });
    //图像上传
    function selectImg(file) {
        if (!file.files || !file.files[0]){
            return;
        }
        if(!checkFile(file.files[0])){
            hintFn('warning' ,'请上传图片类型的头像！')
            return 
        }
        var reader = new FileReader();
        reader.onload = function (evt) {
            var replaceSrc = evt.target.result;
            //更换cropper的图片
            $('#tailoringImg').cropper('replace', replaceSrc,false);//默认false，适应高度，不失真
        }
        reader.readAsDataURL(file.files[0]);
    }
    //cropper图片裁剪
    $('#tailoringImg').cropper({
        aspectRatio: 0 / 0,
        preview: '.previewImg',// 预览视图  
        guides: true, // 裁剪框的虚线(九宫格)
        autoCropArea: 0.5, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        movable: true, // 是否允许移动图片
        dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true, // 是否允许移动剪裁框
        resizable: true, //是否允许改变裁剪框的大小
        scalable:true, //是否可以缩放图片
        zoomable: true, // 是否允许缩放图片大小
        mouseWheelZoom: false, // 是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: false, // 是否允许通过触摸移动来缩放图片
        rotatable: true, // 是否允许旋转图片
        crop: function(e) {
            // 输出结果数据裁剪图像。
        }
    });
    //旋转
    $(".cropper-rotate-btn").on("click",function () {
        $('#tailoringImg').cropper("rotate", 45);
    });
    //复位
    $(".cropper-reset-btn").on("click",function () {
        $('#tailoringImg').cropper("reset");
    });
    //换向
    var flagX = true;
    $(".cropper-scaleX-btn").on("click",function () {
        if(flagX){
            $('#tailoringImg').cropper("scaleX", -1);
            flagX = false;
        }else{
            $('#tailoringImg').cropper("scaleX", 1);
            flagX = true;
        }
        flagX != flagX;
    });

    //裁剪后的处理
    $("#sureCut").on("click",function () {
        if ($("#tailoringImg").attr("src") == null ){
            return false;
        }else{
            var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
            var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
            $("#finalImg").prop("src",base64url);//显示为图片的形式
            var rebackfile = dataURLtoBlob(base64url);
            //关闭裁剪框
            closeTailor();
        }
    });
    //关闭裁剪框
    function closeTailor() {
        $(".tailoring-container").toggle();
    }
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        //[u8arr] [] 不能省略
        return new Blob([u8arr], { type: mime });
    }
    var rebackfile;
    function keepmessage(){
        if ($("#tailoringImg").attr("src") == null ){
            rebackfile=undefined
        }else{
            var cas = $('#tailoringImg').cropper('getCroppedCanvas');//获取被裁剪后的canvas
            var base64url = cas.toDataURL('image/png'); //转换为base64地址形式
            $("#finalImg").prop("src",base64url);//显示为图片的形式
            //关闭裁剪框
            rebackfile = dataURLtoBlob(base64url)
        }
        var nameImg=new Date().getTime()+'.png'
        openland()
        let newfile=new FormData();
        if(isnull(kuanginput.value)&&isnull(describe.value)){
            hintFn('warning' ,"请输入完整内容")
            closeland()
            return
        }
        if(judgeStr(kuanginput.value).length>6){
            hintFn('warning' ,"请输入6个字符以内的用户名！")
            closeland()
            return
        }
        let sex=sexinput[0].checked?'男':"女";
        newfile.append("username",judgeStr(kuanginput.value))
        newfile.append("describes",judgeStr(describe.value))
        newfile.append("sex",sex)
        if(headfile.files[0]!=undefined){
            newfile.append("file",headfile.files[0])
        }
        if(rebackfile!=undefined){
            newfile.append("background_img",rebackfile,nameImg)
        }
        axios({
            method: 'POST',
            url: '/api/remymessage',
            data:newfile,
        })
        .then((result) => {
            closeland()
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
            closeland()
            // console.log(err)
        })
    }