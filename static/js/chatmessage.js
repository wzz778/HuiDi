let sortred=document.getElementsByClassName('sortred')
  //观看是否有消息
  axios({
    url: '/api/getUserIsMessage',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        if(data.data.msg){
            sortred[0].style.display='block'
        }
    }
  }).catch(function (error) {
    
  });
  axios({
    url: '/api/getUserIsChat',
    method: 'get',
  }).then(data => {
    if(data.data.err==0){
        if(data.data.msg){
            sortred[1].style.display='block'
        }
    }
  }).catch(function (error) {
    
  });