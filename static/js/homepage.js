


let cancel = document.getElementsByClassName('cancel');
let confirms  = document.getElementsByClassName('confirm')
let hidden = document.getElementsByClassName('hidden');
let seal = document.getElementsByClassName('seal');
let main = document.getElementsByClassName('main');
let card_body = document.getElementsByClassName('card-body');

function renders(begin,size){
    axios({
        method:'GET',
        url:'/superAdmin/showAllUser',
        params:{
            begin:begin,
            size:size
        }
    }).then(result =>{
        console.log(result.data.msg);
        let all = result.data.msg.records;
        let All = '';
        for(let i=0;i<all.length;i++){
            All += `
            <ul class="card-body-list">
                <li class="card-list-number">${i}</li>
                <li class="card-list-name">${all[i].name}</li>
                <li class="card-list-sex">${all[i].sex}</li>
                <li class="card-list-status">封号</li>
                <li class="card-list-mail">${all[i].mail}</li>
                <li class="card-list-other">
                    <button class="btn forbiding">
                        <img src="public/iconfont/warn.png" alt="" class="forbid">
                        禁言
                    </button>
                    <button class="btn seal">
                        <img src="public/iconfont/forbid.png" alt="" class="forbid">
                        封号
                    </button>
                </li>
            </ul>
            `
        }
        card_body[0].innerHTML += All;
        page_current[0].maxNumber = result.data.msg.pages;
        page_current[0].all_size = result.data.msg.total;
        console.log(page_current[0].maxNumber);
        renderPaging(renders,page_current[0].maxNumber,page_current[0].all_size);
        for(let j=0;j<all.length;j++){
            seal[j].ids = all[j].id;
            seal[j].onclick = function(){
                hidden[0].style.display = 'block';
            }
        }
    })
}
renders(1,5);


cancel[0].onclick  = function(){
    hidden[0].style.display = 'none';
}
confirms[0].onclick  = function(){
    hidden[0].style.display = 'none';
}

