let detail = document.getElementsByClassName('detail');
let card_body_main = document.getElementsByClassName('card-body-main');


function renders(begin_index,size){
    axios({
        method:'GET',
        url:'/superAdmin/acceptReport',
        params:{
            begin_index:begin_index,
            size:size
        }
    }).then(result =>{
        console.log(result.data);
        page_current[0].maxLength = result.data.msg.all_page;
        page_current[0].all_size = result.data.msg.all_count
        page_current[0].cur_index = result.data.msg.cur_index
        page_current[0].size = result.data.msg.size
        let all = '';
        for(let i=0;i<result.data.msg.list.length;i++){
            all += `<ul class="card-body-list">
                        <li class="card-list-number">${i+1}</li>
                        <li class="card-list-name">${result.data.msg.list[i].ob.user.name}</li>
                        <li class="card-list-sex">${result.data.msg.list[i].ob.user.sex}</li>
                        <li class="card-list-mail">${result.data.msg.list[i].ob.user.mail}</li>
                        <li class="card-list-status">${result.data.msg.list[i].message}</li>
                        <li class="card-list-other">
                            <button class="btn forbiding">
                                <img src="public/iconfont/warn.png" alt="" class="forbid">
                                警告
                            </button>
                            <button class="btn detail">
                                <img src="public/iconfont/detail1.png" alt="" class="forbid">
                                详情
                            </button>
                        </li>
                    </ul>`
        }
        card_body_main[0].innerHTML = all;
        renderPaging(renders,page_current[0].maxLength,page_current[0].all_size,-1)
    })
}
renders(1,5)