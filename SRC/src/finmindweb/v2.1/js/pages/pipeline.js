import {sysConstants} from '../core/sysConst.js'
import {credMan} from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';
import {HomeAndWizardHeader} 		from './../pages/header.js';
import {ApplicationQAndAManager}	from '../core/applicationQAndAManager.js'
import { MessagingPanel } 			from '../core/messagingPanel.js'
import {UploadedFileListPanel}		from '../core/fileListPanel.js';

const page_template = `
<div class="card position-fixed start-0 end-0 bottom-0 border-0 rounded-0 px-3 pb-3" style="top: 6rem;background: #F6F7FC;">
    <div class="d-flex justify-content-center align-items-center p-4">
        <div class="d-flex align-items-center mx-1">
            <span class="bg-primary text-white fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;">
                1
            </span>
            <b class="mx-2">Collect more info</b>
            <span class="border-bottom" style="width: 5.625rem;border-color: rgba(31, 21, 52, 0.2);"></span>
        </div>
        <div class="d-flex align-items-center mx-1">
            <span class="text-body text-black-50 fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;border: 0.0625rem solid rgba(31, 21, 52, 0.2);">
                2
            </span>
            <b class="mx-2 text-body text-black-50">PARAMED Exam</b>
            <span class="border-bottom" style="width: 5.625rem;border-color: rgba(31, 21, 52, 0.2);"></span>
        </div>
        <div class="d-flex align-items-center mx-1">
            <span class="text-body text-black-50 fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;border: 0.0625rem solid rgba(31, 21, 52, 0.2);">
                3
            </span>
            <b class="mx-2 text-body text-black-50">Underwriting Process</b>
            <span class="border-bottom" style="width: 5.625rem;border-color: rgba(31, 21, 52, 0.2);"></span>
        </div>
        <div class="d-flex align-items-center mx-1">
            <span class="text-body text-black-50 fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;border: 0.0625rem solid rgba(31, 21, 52, 0.2);">
                4
            </span>
            <b class="mx-2 text-body text-black-50">Approved</b>
        </div>
    </div>
    
    <div class="card-body bg-white m-0 p-0">
        <div class="card h-100 border-0 rounded-0">
            
            <div class="card-header bg-transparent d-flex justify-content-between align-items-center p-3">
                <div class="d-flex align-content-center">
                    <span class="me-5">
                        <img src="../img/ico-joinus-customer.svg" style="width: 1.5rem;">
                        <b class="ms-11 me-2">Client</b>
                        <span id="customerName">Pete Cooper</span>
                    </span>
                    <span id="producerNameOrFindOne">
                        <img src="../img/ico-joinus-producer.svg" style="width: 1.5rem;">
                        <b class="ms-1 me-2">Producer</b>
                    </span>
                </div>
                <div>
                    <a class="btn btn-outline-primary fw-bold" href="#" data-bs-toggle="modal" data-bs-target="#CancelApplication">Cancel Application</a>
                    <a class="btn btn-primary fw-bold ms-3" href="#" role="button">Notify Producer</a>
                </div>
            </div>
            
            <div class="card-body p-0">
                <div class="row h-100 g-0">
                    <div class="col-2 border-end">
                        <div class="card h-100 border-0 rounded-0">
                            <div class="card-header bg-transparent p-3 fw-bold border-bottom-0">
                                <img src="../img/ico-folders.svg" class="me-3">Uploaded Files
                            </div>
                            <div class="card-body p-0 overflow-auto" style="height: 0;">
                                <ul id="fm_ul_uploaded_files" class="list-group list-group-flush list-group-files mx-3">    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-7 border-end">
                        <div class="card h-100 border-0 rounded-0">
                            <div class="card-body px-0 overflow-auto" style="height: 0;">
                                <div class="row g-0 justify-content-center">
                                    <div class="col-11 pt-3">
                                        <div class="nav-back">
                                            <a href="#" id="fm_wz_prev_block_button" class="text-body text-opacity-50 text-decoration-none">Back</a>
                                        </div>
                                    </div>
                                    <div class="col-10">
                                        <div class="mb-4">
                                            <h5 class="text-center mb-5" id="fm_wz_block_name"></h5>    
                                        </div>
                                        <div class="mb-4">
                                            <h2 id="fm_wz_block_description"></h1>    
                                        </div>
                                        <div id="user_question_block"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-transparent text-center border-0 py-5 px-0">
                                <button id="fm_wz_next_block_button" class="btn btn-primary btn-xl w-50" type="submit">
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="card h-100 border-0 rounded-0">
                            <div class="card-header bg-transparent p-3 fw-bold">
                                <img src="../img/ico-chats.svg" class="me-3">
                                Chat
                            </div>
                            <div class="card-body overflow-auto" style="height: 0;" id="chat-list-scroll-area">
                                <div id="fm_div_chats" class="chat-list">                                                    
                                </div>
                            </div>
                            <div class="card-footer bg-transparent d-flex">
                                <a href="#" id="fm_div_chats_file_upload" class="flex-shrink-0 mt-1">
                                    <img src="../img/ico-chat-upload.svg">
                                </a>
                                <div class="flex-grow-1 px-2">
                                    <textarea id="fm_div_chats_msg_textarea" class="form-control border-0" placeholder="Type a message here" rows="2"></textarea>
                                </div>
                                <a href="#" id="fm_div_chats_send" class="chat-send rounded-circle flex-shrink-0 position-relative"></a>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</div>

<!-- Find a FinMind Producer -->
<div class="modal fade" id="FindProducerModal" tabindex="-1" aria-labelledby="FindProducerModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header justify-content-center border-0">
                <h5 class="modal-title pt-4">Find a FinMind Producer</h5>
            </div>
            <div class="modal-body px-5 py-3">
                <div>
                    <label for="Email" class="form-label">Email</label>
                    <input type="email" class="form-control form-control-lg" placeholder="Please enter producer email address">
                </div>
            </div>
            <div class="modal-footer p-5 justify-content-between border-0">
                <button type="button" class="btn fw-bold btn-outline-secondary m-0" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn fw-bold btn-primary m-0">Confirm</button>
            </div>
        </div>
    </div>
</div>

<!-- cancel application -->
<div class="modal fade" id="CancelApplication" tabindex="-1" aria-labelledby="CancelApplication" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header justify-content-center border-0">
                <h5 class="modal-title pt-4">Sure to cancel your application?</h5>
            </div>
            <div class="modal-body px-3 py-0">
                <p class="text-center text-body text-opacity-75">
                    Once cancelled all profiles, messages and chat logs will no longer exist.
                </p>
                <div class="mx-5 px-5">
                    <img src="../img/bg-questions.png" class="img-fluid">
                </div>
            </div>
            <div class="modal-footer p-5 justify-content-between border-0">
                <button type="button" class="btn fw-bold btn-outline-secondary m-0" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn fw-bold btn-primary m-0">Confirm</button>
            </div>
        </div>
    </div>
</div>
`;

const findProducer = `
<a href="" class="fw-bold" data-bs-toggle="modal" data-bs-target="#FindProducerModal">Find a FinMind Producer</a>
`;

const producerName = `
<span>{producerName}</span>
`;

const SIGNIN_PATH="/prelogin/login.html";

class PipelinePageHandler {
    #credMan;
    #applicationMan;
    #currentBlockIsDynamic;
    #messagingPanel;
    #filePanel;

    constructor(credMan) {
        this.#credMan = credMan;
        this.init();
    }

    // hook up events
    async init() {

        // 如果状态失效，跳转到登录页面
        const loggedIn = await this.#credMan.hasLoggedIn();
        if (!loggedIn) {
            window.location.href = SIGNIN_PATH;
        }

        // when 'Start' button is clicked
        $('#fm_wz_next_block_button').click(this.handleNextQuestionBlock.bind(this));

        // when 'Next button' is clicked
        $('#fm_wz_next_block_button2').click(this.handleNextQuestionBlock.bind(this));

        // when 'Back' or '<' button is clicked
        $('#fm_wz_prev_block_button').click(this.handlePrevQuestionBlock.bind(this));
        $('#fm_wz_prev_block_button2').click(this.handlePrevQuestionBlock.bind(this));

        // send a chat message to server
        $('#fm_div_chats_send').click(this.handleChatSend.bind(this));

        // upload a file to server
        $('#fm_div_chats_file_upload').click(this.handleFileUpload.bind(this));

        // start testing

        // $('#fm_wz_test_button').click(this.handleTest.bind(this));
        //
        // // start validating and saving
        // $('#fm_wz_test_button2').click(this.handleTest2.bind(this));


        // const appId = 89899992;
        const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
        let appId = parseInt(this.getUrlParam('appId'));
        this.#applicationMan = new ApplicationPipelineManager(sessionStore, appId);
        $('#customerName').text(this.#credMan.credential.name);

        // 更新申请详情
        await this.updateApplicationInfo(appId);

        // fill messages
        this.#messagingPanel = new MessagingPanel(100, appId);

        const msgHtml = await this.#messagingPanel.getMessages();
        if (msgHtml) {
            $('#fm_div_chats').append(msgHtml);
        }

        // fill uploaded files
        this.#filePanel = new UploadedFileListPanel(appId);

        const flHtml = await this.#filePanel.getUploadedFiles();
        if (flHtml) {
            $('#fm_ul_uploaded_files').html(flHtml);
        }
        // hook up file delete and download events handler
        this.#filePanel.changeEvent();


    }

    async updateApplicationInfo(appId) {
        // 获取申请详情
        let appInfo = await Net.getApplicationInfo(appId, credMan.credential.token);
        if (appInfo.code===0) {
            let row = appInfo.data[0];
            if (row.agent_name!=null) {
                $('#producerNameOrFindOne').append(producerName.replace('{producerName}', row.agent_name));
            } else {
                $('#producerNameOrFindOne').append(findProducer);
            }
        }
        console.log();
    }

    getUrlParam(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    async handleChatSend(e) {
        e.preventDefault();
        const msg = $('#fm_div_chats_msg_textarea').val();
        if (msg) {
            const msgHtml = await this.#messagingPanel.sendMsg(1, msg);
            if (msgHtml) {
                $('#fm_div_chats').append(msgHtml);
            }
        }
    }

    async handleFileUpload(e) {
        e.preventDefault();
    }

    // When user clicks 'prev (<)', we need to
    //   	1) go back to previousoly process block by 1
    //		2) display the ui for previous block
    //
    handlePrevQuestionBlock(e) {
        e.preventDefault();
        this.populatePreviousQuestionBlock();
    }

// When user clicks 'next', we need to call
    //   	handleNextQuestionBlockInternal
    // with 'false' flag
    //
    async handleNextQuestionBlock(e) {
        e.preventDefault();
        await this.handleNextQuestionBlockInternal();
    }

    // When user clicks 'more', we need to call
    //   	handleNextQuestionBlockInternal
    // with 'true' flag
    //
    async handleDuplicateBlock(e) {
        e.preventDefault();
        await this.handleNextQuestionBlockInternal(true);
    }

    // When user clicks 'next', we need to
    //   	1) validate the selection and
    //		2) save the questions to server
    //		3) populate the next block questions or conclude
    //
    async handleNextQuestionBlockInternal() {
        // validate and save the current block of question answers
        const canMove =
            await this.#applicationMan.validateAndSaveCurrentBlock(this.#credMan.credential.token);

        // get next block of questions
        if (canMove) {
            await this.populateNextQuestionBlock();
        }
    }

    // Get previous blck of questions from local cache and dispolay it
    populatePreviousQuestionBlock() {
        //const appId =  999;
        if (this.#applicationMan.canGotoPreviousBlock()) {
            const qHtml = this.#applicationMan.previousBlock();
            if (qHtml) {
                $('#user_question_block').html(qHtml);

                this.#applicationMan.hookUpEvents();
                return;
            }
        }

        // no more blocks
        alert ('no more questions to answer');
        $('#user_question_block').html('');
        $('#fm_wz_next_block_button').text('Start');
    }

    // Get next blck of questions from finMind and dispolay it
    async populateNextQuestionBlock() {
        const qHtml = await this.#applicationMan.nextBlock(this.#credMan.credential.token);
        if (qHtml) {
            if (qHtml.quote) {
                // go to application page
                window.location.href = "./application/app-before-sign-in.html";
            }
            else {
                // first set the block header and subtitle
                const blockInfo = await Net.getBlockInfo(this.#applicationMan.blockId);
                $('#fm_wz_block_name').text(blockInfo.blockName);
                $('#fm_wz_block_description').text(blockInfo.blockDescription);

                // then set the html for all the questions of the block
                $('#user_question_block').html(qHtml);
                $('#fm_wz_next_block_button').text('Next');

                // show or hide "more" button
                if (blockInfo.creation_flag == 1) {
                    this.#currentBlockIsDynamic = true;
                    $('#fm_wz_duplicate_block_button').show();
                }
                else {
                    this.#currentBlockIsDynamic = false;
                    $('#fm_wz_duplicate_block_button').hide();
                }

                this.#applicationMan.hookUpEvents();
                return;
            }
        }

        // no more blocks
        alert ('no more questions to answer');
        $('#user_question_block').html('');
        $('#fm_wz_next_block_button').text('Start');
    }

}

let pipelinePageHandler = null;

$( document ).ready(function() {
    console.log( "index page ready!" );
    $("#pageContainer").html(page_template);
    pipelinePageHandler = new PipelinePageHandler(credMan);
});
