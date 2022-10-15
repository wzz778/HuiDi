let change = document.getElementsByClassName('change');
let changee = document.getElementsByClassName('changes');
let signing = document.getElementsByClassName('signing');
let dib = document.getElementsByClassName('dib');
let drop_down = document.getElementsByClassName('drop-down');
let manage_name = document.getElementsByClassName('manage-name');
let manage_img = document.getElementsByClassName('manage-img');
let flag2 = true;
let out = document.getElementsByClassName('out');
dib[0].onclick = function(){
    if(flag2){
        drop_down[0].style.display = 'block';
        flag2 = false
    }else{
        drop_down[0].style.display = 'none';
        flag2 = true;
    }
}

function Login(){
    axios({
        method:'GET',
        url:'/superAdmin/gainId',

    }).then(result =>{
        // console.log(result.data);
        manage_name[0].innerHTML = `${result.data.msg.name }  <i><img src="public/iconfont/arrow1.png" alt="" class="arrow"></i>`
        manage_img[0].src = result.data.msg.img_url;
    })
}
Login();


out[0].onclick = function(){
    axios({
        method:'GET',
        url:'/api/outlogin',
    }).then(result =>{
        if(result.data.err == 0){
            window.location.href = '/login'
        }
    })
}