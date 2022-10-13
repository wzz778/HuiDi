// let forbiding = document.getElementsByClassName('forbiding');
let page_current = document.getElementsByClassName('page-current');
let page_left = document.getElementsByClassName('page-left');
let page_right = document.getElementsByClassName('page-right'); 
let page_input = document.getElementsByClassName('page-input');
let pageSize = document.getElementsByClassName('pageSize');
let page_size = document.getElementsByClassName('page-size');

// forbiding[0].onclick = function(){
//     hidden[0].style.display = 'block';
// }

function renderPaging(name,maxLength,all_size,numbers){
    console.log(maxLength);
    page_size[0].innerHTML = '共' + all_size + '条';
    pageSize[0].onchange = function(){
        console.log(this.value,page_current[0].innerHTML);
        if(numbers == -1){
            name(page_current[0].innerHTML,pageSize[0].value);
        }else{
            name(page_current[0].innerHTML,pageSize[0].value,numbers);
        }
    }
    page_left[0].onclick = function(){
        let num = page_current[0].innerText;
        if(page_current[0].innerHTML == 1){
    
        }else{
            num--;
            page_right[0].style.cursor = 'pointer';
            page_current[0].innerHTML = num;
            if(numbers == -1){
                name(page_current[0].innerHTML,pageSize[0].value);
            }else{
                name(page_current[0].innerHTML,pageSize[0].value,numbers);
            }
            if(page_current[0].innerHTML == 1){
                page_left[0].style.cursor = 'not-allowed';
            }
        }
    }
    
    if(maxLength == 1){
        page_right[0].style.cursor = 'not-allowed';
        
    }else{
        page_right[0].onclick = function(){
            let num = page_current[0].innerText;
            if(page_current[0].innerHTML > maxLength){
                
            }else{
                num++;
                page_left[0].style.cursor = 'pointer';
                page_current[0].innerHTML = num;
                if(numbers == -1){
                    name(page_current[0].innerHTML,pageSize[0].value);
                }else{
                    name(page_current[0].innerHTML,pageSize[0].value,numbers);
                }
                if(page_current[0].innerHTML == maxLength){
                    page_right[0].style.cursor = 'not-allowed';
                }
            }
        }
    }

    page_input[0].oninput = function(){
        this.value=this.value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');
        if (this.value / 1 > maxLength) {
            this.value = this.value + "";
            this.value = this.value.slice(0, this.value.length - 1);
        }
    }
    page_input[0].addEventListener('keydown',function(e){
        if(e.keyCode == 13){
            console.log(1);
            page_current[0].innerHTML = page_input[0].value;
        }
    })
}



function generatePagination(pages, pageSize, pageIndex,all_size,name,numbers) {

    /* 创建style标签并设置style样式 */
    let style = document.createElement('style');
    style.innerHTML = "#pagination{width:100%;margin-top:30px;display:flex;padding-left:0;}#pageTips{right:10px;font-size:15px;margin-right:15px;}ul li{list-style:none;user-select:none;}.list-items{margin-left:5px;display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;background-color:#fff;color:#000;cursor:pointer;transition:all .3s;border:1px solid #dedede;border-radius:5px;}.list-items:hover{background-color:#e9ecef;border-color:#dee2e6; }.active,.active:hover{color:#fff;background-color:#C8261C;border-color:#C8261C;}#btnPrev{width:60px}#btnNext{width:60px}"
    document.getElementsByTagName('head').item(0).appendChild(style);

    /*  
     需要一个<ul id="pagination"></ul>标签
     pages; // 总页数
     pageSize; // 一页显示数量
     pageIndex; // 当前页 
    */
    let totalPage = pages;  // 总页数
    function initPagination() {
        let pagination = document.querySelector('#pagination');
        let pageHtml;  // 按钮内容
        let prevButton = `<li class='list-items' id='btnPrev'>上一页</li>` // 向左
        let nextButton = `<li class='list-items' id='btnNext'>下一页</li>`// 向右
        let firstPage = `<li class='list-items' pagenumber=1>1</li>`// 第一页
        let lastPage = `<li class='list-items' pagenumber=${totalPage}>${totalPage}</li>` // 最后一页
        let leftOmitPage = `<li class='list-items' id='btnGoLeft'>...</li>` // 省略号
        let rightOmitPage = `<li class='list-items' id='btnGoRight'>...</li>` // 省略号
        let pageTips = `<div style='line-height:38px;display:inline-block;' id='pageTips'>共${all_size}条</div > `;
        let pageInputs = `<div style="display:inline-block;margin-left: 20px;"><span style="display:inline-block;vertical-align: 4px;">跳转到</span><input type="text" class="page-input" value="${pageIndex}"><span style="display:inline-block;vertical-align: 4px;">页</span></div>`
        let pageButton = `<button class="page-button">确定</button>`;
        pageHtml = pageTips; // 添加向左的按钮

        pageHtml += prevButton;
        /* 生成页数 */
        if (totalPage <= 5) {  // 总页数小于等于5页全部显示
            for (let i = 1; i <= totalPage; i++) {
                pageHtml += `<li class='list-items' pagenumber=${i}>${i}</li>`;
            }
        } else if (pageIndex <= 3) { //总页数大于5且当前页远离总页数
            for (let i = 1; i <= 5; i++) {
                pageHtml += `<li class='list-items' pagenumber=${i}>${i}</li>`;
            }
            pageHtml += rightOmitPage;
            pageHtml += lastPage;
        } else if (pageIndex > totalPage - 5) { //总页数大于5且当前页接近总页数
            pageHtml += firstPage;
            pageHtml += leftOmitPage;
            for (let i = totalPage-5 ; i <= totalPage; i++) {
                pageHtml += `<li class='list-items' pagenumber=${i}>${i}</li>`;
            }
        } else { //除开上面两个情况 当前页在中间
            pageHtml += firstPage;
            pageHtml += leftOmitPage;
            for (let i = pageIndex - 2; i <= pageIndex + 2; i++) {
                pageHtml += `<li class='list-items' pagenumber=${i}>${i}</li>`;
            }
            pageHtml += rightOmitPage;
            pageHtml += lastPage;
        }
        pageHtml += nextButton; // 添加向右的按钮
        // pageHtml += pageInputs; // 添加跳转页面的输入框
        // pageHtml += pageButton; // 确定跳转的按钮
        pagination.innerHTML = pageHtml;
        document.querySelector("li[pagenumber='" + pageIndex + "']").classList.add('active');

        let pagenumberBtns = document.querySelectorAll("li[pagenumber]"); // 获取所有的页码按钮

        /* 点击页码按钮进行翻页 */
        pagenumberBtns.forEach(function (elements) {
            elements.onclick = function () {
                pageIndex = Number(this.innerHTML); // 当前页
                document.querySelector("li[pagenumber='" + pageIndex + "']").classList.add('active');
                pageHtml.innerHTML = '';
                if(numbers == -1){
                    name(pageIndex,pageSize);
                }else{
                    name(pageIndex,pageSize,numbers);
                }
                
                initPagination();
            }
        })

        /* 向左翻页 */
        document.getElementById('btnPrev').addEventListener("click", function () {
            if (pageIndex > 1) {
                pageIndex--;
                pageHtml.innerHTML = '';
                if(numbers == -1){
                    name(pageIndex,pageSize);
                }else{
                    name(pageIndex,pageSize,numbers);
                }
                initPagination();
            }
        })

        /* 向右翻页 */
        document.getElementById('btnNext').addEventListener("click", function () {
            if (pageIndex < totalPage) {
                pageIndex++;
                pageHtml.innerHTML = '';
                if(numbers == -1){
                    name(pageIndex,pageSize);
                }else{
                    name(pageIndex,pageSize,numbers);
                }
                initPagination();
            }
        })

        /* 向左快速翻页 */
        let btnGoLeft = document.getElementById('btnGoLeft');
        if (btnGoLeft) {
            btnGoLeft.addEventListener('mouseenter', function () {
                this.innerHTML = '&lt;'
            })
            btnGoLeft.addEventListener('mouseleave', function () {
                this.innerHTML = '...'
            })
            btnGoLeft.addEventListener("click", function () {
                if (pageIndex > 10) {
                    pageIndex -= 10;
                    pageHtml.innerHTML = '';
                    if(numbers == -1){
                        name(pageIndex,pageSize);
                    }else{
                        name(pageIndex,pageSize,numbers);
                    }
                    initPagination();
                }
            })
        }

        /* 向右快速翻页 */
        let btnGoRight = document.getElementById('btnGoRight')
        if (btnGoRight) {
            btnGoRight.addEventListener('mouseenter', function () {
                this.innerHTML = '&gt;'
            })
            btnGoRight.addEventListener('mouseleave', function () {
                this.innerHTML = '...'
            })
            btnGoRight.addEventListener("click", function () {
                if (pageIndex < totalPage - 5) {
                    pageIndex += 5;
                    pageHtml.innerHTML = '';
                    if(numbers == -1){
                        name(pageIndex,pageSize);
                    }else{
                        name(pageIndex,pageSize,numbers);
                    }
                    initPagination();
                }
            })
        }


        // let pageInputes = document.getElementsByClassName('page-input');
        // pageInputes[0].addEventListener('input',function(){
        //     // this.value = pageIndex;
        //     this.value=this.value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1');
        //     if (this.value / 1 > pages) {
        //         this.value = this.value + "";
        //         this.value = this.value.slice(0, this.value.length - 1);
        //     }
        // })

        // let button = document.getElementsByClassName('page-button');
        // button[0].onclick = function(){
        //     pageIndex = button[0].value;
        //     // document.querySelector("li[pagenumber='" + pageIndex + "']").classList.add('active');
        //     pageHtml.innerHTML = '';
        //     name(pageIndex,pageSize);
        //     initPagination();
        // }


        // document.querySelector("li[pagenumber='" + pageIndex + "']").classList.add('active');
    
    }
    initPagination();
    
}