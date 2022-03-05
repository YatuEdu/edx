const pageTemplate = `
<div id="fm-pagination" class="d-flex justify-content-between mt-3 mx-4 fs-8">
    <div class="text-secondary">
        showing {numShowing} out of {total}
    </div>
    <div class="d-flex align-items-center">
        <span class="text-secondary">Page {pageNo} of {pageTotal}</span>
        <ul class="pagination pagination-sm justify-content-end my-0 ms-3 event-table-pagination">
            <li id="fm-pg-prev" class="page-item"><a class="page-link" href="#"><svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.012 4.5l3.305 3.404a.653.653 0 0 1 0 .907.607.607 0 0 1-.881 0L.78 5.045A.636.636 0 0 1 .5 4.5a.662.662 0 0 1 .28-.546L4.436.188a.614.614 0 0 1 .88 0 .653.653 0 0 1 0 .907L2.013 4.5z" fill="#8D93A6"/></svg></a></li>
            <li id="fm-pg-box1" class="page-item"><a class="page-link" href="#">{box1}</a></li>
            <li id="fm-pg-box2" class="page-item"><a class="page-link" href="#">{box2}</a></li>
            <li id="fm-pg-box3" class="page-item"><a class="page-link" href="#">{box3}</a></li>
            <li id="fm-pg-next" class="page-item"><a class="page-link" href="#"><svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.988 4.5L.683 7.903a.653.653 0 0 0 0 .907.607.607 0 0 0 .881 0L5.22 5.045A.636.636 0 0 0 5.5 4.5a.662.662 0 0 0-.28-.546L1.564.188a.614.614 0 0 0-.88 0 .653.653 0 0 0 0 .907L3.987 4.5z" fill="#8D93A6"/></svg></a></li>
        </ul>
        <input id="pageGo" class="form-control form-control-sm text-center position-relative" type="text" style="width: 43px;border-color: #dddfe5;">
    </div>
</div>
`;

class Pagination {

    #pageContainer;
    #pageSize;
    #total;
    #pageNo;
    #boxList = [];

    constructor(pageContainer, pageSize, total) {


        this.#pageContainer = pageContainer;
        this.#pageSize = pageSize;
        this.#total = total;
        this.#pageNo = 1;
        let pages = Math.ceil(this.#total/this.#pageSize);
        if (pages<=0) {
            this.#boxList = [];
        } else if (pages==1) {
            this.#boxList = [1];
        } else if (pages==2) {
            this.#boxList = [1, 2];
        } else if (pages>=3) {
            this.#boxList = [1, 2, 3];
        }

        this.render();

    }

    next() {
        // 确定是否能移动
        if (this.#pageNo>=Math.ceil(this.#total/this.#pageSize)) {
            return;
        }
        // 先修改box内容
        if (this.#boxList.length>=3 && this.#boxList[2]<=this.#pageNo) {
            this.#boxList[0] = this.#boxList[0]+1;
            this.#boxList[1] = this.#boxList[1]+1;
            this.#boxList[2] = this.#boxList[2]+1;
        }
        // 再聚焦某个box
        this.#pageNo = this.#pageNo+1;
        this.render();
    }

    prev() {
        // 确定是否能移动
        if (this.#pageNo<=1) {
            return;
        }
        // 先修改box内容
        if (this.#boxList.length>=3 && this.#boxList[0]>=this.#pageNo) {
            this.#boxList[0] = this.#boxList[0]-1;
            this.#boxList[1] = this.#boxList[1]-1;
            this.#boxList[2] = this.#boxList[2]-1;
        }
        // 再聚焦某个box
        this.#pageNo = this.#pageNo-1;
        this.render();
    }

    goBox(i) {
        this.#pageNo = this.#boxList[i];
        this.render();
    }

    goPage(page) {
        let pages = Math.ceil(this.#total/this.#pageSize);
        if (page>=1 && page<=pages) {
            if (this.#boxList.length>=3) {
                if (page==1) {
                    this.#boxList[0] = 1;
                    this.#boxList[1] = 2;
                    this.#boxList[2] = 3;
                } else if (page==pages) {
                    this.#boxList[0] = pages-2;
                    this.#boxList[1] = pages-1;
                    this.#boxList[2] = pages;
                } else {
                    this.#boxList[0] = page-1;
                    this.#boxList[1] = page;
                    this.#boxList[2] = page+1;
                }
            }
        }
        this.#pageNo = page;

        this.render();
    }

    render() {
        $('#fm-pagination').remove();
        let numShowed = (this.#pageNo-1)*this.#pageSize;
        let numShowing = this.#total > numShowed+this.#pageSize ? this.#pageSize : this.#total-numShowed;
        this.#pageContainer.append(
            pageTemplate
                .replace('{numShowing}', numShowing)
                .replace('{total}', this.#total)
                .replace('{pageNo}', this.#pageNo)
                .replace('{pageTotal}', Math.ceil(this.#total/this.#pageSize))
                .replace('{box1}', this.#boxList.length>=1 ? this.#boxList[0] : '')
                .replace('{box2}', this.#boxList.length>=2 ? this.#boxList[1] : '')
                .replace('{box3}', this.#boxList.length>=3 ? this.#boxList[2] : '')
        );
        $('li[id^=fm-pg-box]').removeClass('active');
        for(let i in this.#boxList) {
            let b = this.#boxList[i];
            if (b === this.#pageNo) {
                let tag = '#fm-pg-box' + (Number(i)+1);
                $(tag).addClass('active');
            }
        }

        $('#fm-pg-next').click(this.next.bind(this));
        $('#fm-pg-prev').click(this.prev.bind(this));
        if (this.#boxList.length>=1)
            $('#fm-pg-box1').click(this.goBox.bind(this, 0));
        if (this.#boxList.length>=2)
            $('#fm-pg-box2').click(this.goBox.bind(this, 1));
        if (this.#boxList.length>=3)
            $('#fm-pg-box3').click(this.goBox.bind(this, 2));
        let that = this;
        $("#pageGo").keypress(function (e) {
            if (e.which === 13) {
                let page = Number($("#pageGo").val());
                that.goPage(page);
            }
        });

    }
}

export { Pagination };