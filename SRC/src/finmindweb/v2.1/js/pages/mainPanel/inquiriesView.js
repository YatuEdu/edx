import {credMan} from "../../core/credManFinMind.js";
import {SessionStoreAccess} from "../../core/sessionStorage.js";
import {sysConstants} from "../../core/sysConst.js";
import {Net} from '../../core/net.js';

const pageTemplate = `
<div class="container-fluid position-fixed start-0 end-0 bottom-0 p-0" style="top: 0rem;">
    <div class="row h-100 g-0">

        <div class="col-10 bg-white" style="border: 11px solid #FAFCFF;">
            <div class="card h-100 border-0 rounded-0">
                <div class="card-header d-flex align-items-center bg-white p-4 border-0">
                    <h5 class="m-0">
                        <span class="fs-7 text-secondary">My Inquiries</span>
                        <svg class="mx-2" width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.667 1.333L5.333 6 .667 10.667" stroke="#C0C4CC"/></svg>
                        Quote Details
                    </h5>
                </div>
                <div class="card-body p-0 position-relative overflow-auto" style="height: 0;">
                    <div class="mx-4" id="table">
                        <h5 class="text-center">{clientName}</h5>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

const blkTemplate = `
<hr class="my-4">
<h6 class="mb-3">{title}</h6>
`;

const rowTemplate = `
<div class="text-secondary mb-2">{attrName}{isQuestion}{attrValue}</div>
`;

class InquiriesView {
    constructor(credMan) {
        this.init();
    }
    
    async init() {
        const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_INQUIRIES_VIEW_KEY);
        let info = JSON.parse(sessionStore.getItem());
        let clientName = info.clientName;
        let quoteDetail = atob(info.quoteDetails);
        quoteDetail = eval('(' + quoteDetail + ')');
        let blkMap = new Map();
        let blkInfoMap = new Map();
        for(let item of quoteDetail) {
            let blkId = item['block_id'];
            let arr = blkMap.get(blkId);
            if (arr==null) {
                arr = new Array();
                blkMap.set(blkId, arr);
                let res = await Net.getBlockInfo(blkId);
                blkInfoMap.set(blkId, res);
            }
            arr.push(item);
        }

        $("body").append(pageTemplate.replace("{clientName}", clientName));
        for (let [key, value] of blkMap) {
            console.log(key + ' = ' + value);
            let attrArr = value;
            let blkId = attrArr[0].block_id;
            let blkInfo = blkInfoMap.get(blkId);
            let blk = blkTemplate.replace("{title}", blkInfo.blockName);
            for(let attr of attrArr) {
                let attrName = attr.attr_label.trim();
                let isQuestion = false;
                if(attrName==null || attrName==='') {
                    attrName = attr.attr_question;
                }
                if (attrName.substr(-1)==='?') {
                    isQuestion = true;
                }
                let attrValue = attr.sv1;
                let row = rowTemplate.replace("{attrName}", attrName)
                    .replace("{isQuestion}", isQuestion?'</br>': ':')
                    .replace("{attrValue}", attrValue);
                blk = blk + row;
            }
            $("#table").append(blk);
        }
    }
}

let inquiriesViewHandler = null;

$( document ).ready(function() {
    console.log( "InquiriesView page ready!" );
    inquiriesViewHandler = new InquiriesView(credMan);

});
