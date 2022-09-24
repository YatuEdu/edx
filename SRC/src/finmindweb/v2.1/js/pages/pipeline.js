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
import {MetaDataManager} from "../core/metaDataManager.js";
import {FileUploadUtil} from "../core/fileUploadUtil.js";

const page_template = `
<div class="card position-fixed start-0 end-0 bottom-0 border-0 rounded-0 px-3 pb-3" style="top: 6rem;background: #F6F7FC;">
    <div class="d-flex justify-content-center align-items-center p-4">
        <div class="d-flex align-items-center mx-1" id="step1Div">
            <span class="bg-primary text-white fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;">
                1
            </span>
            <b class="mx-2">Collect more info</b>
            <span class="border-bottom" style="width: 5.625rem;border-color: rgba(31, 21, 52, 0.2);"></span>
        </div>
        <div class="d-flex align-items-center mx-1" id="step2Div">
            <span id="step2" class="text-body text-black-50 fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;border: 0.0625rem solid rgba(31, 21, 52, 0.2);">
                2
            </span>
            <b  id="step2Text" class="mx-2 text-body text-black-50">Underwriting Process</b>
            <span class="border-bottom" style="width: 5.625rem;border-color: rgba(31, 21, 52, 0.2);"></span>
        </div>
        <div class="d-flex align-items-center mx-1" id="step3Div">
            <span id="step3" class="text-body text-black-50 fs-6p fw-bold rounded-pill d-flex justify-content-center align-items-center" style="width: 2rem;height: 2rem;border: 0.0625rem solid rgba(31, 21, 52, 0.2);">
                3
            </span>
            <b id="step3Text" class="mx-2 text-body text-black-50">Policy Delivery</b>
        </div>
    </div>
    
    <div class="card-body bg-white m-0 p-0">
        <div class="card h-100 border-0 rounded-0">
            
            <div class="card-header bg-transparent d-flex justify-content-between align-items-center p-3">
                <div class="d-flex align-content-center">
                    <span class="me-5">
                        <img src="../img/ico-joinus-customer.svg" style="width: 1.5rem;">
                        <b class="ms-11 me-2">Client</b>
                        <span id="customerName"></span>
                    </span>
                    <span id="producerNameOrFindOne">
                        <img src="../img/ico-joinus-producer.svg" style="width: 1.5rem;">
                        <b class="ms-1 me-2">Producer</b>
                    </span>
                </div>
                <div id="operateDiv">
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
                                        <div class="mb-4" id="descriptionDiv">
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
                                    <input id="chats_file_upload" type="file" style = "display:none">
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
                    <input type="email" id="producerEmailInput" class="form-control form-control-lg" placeholder="Please enter producer email address">
                </div>
            </div>
            <div class="modal-footer p-5 justify-content-between border-0">
                <button type="button" class="btn fw-bold btn-outline-secondary m-0" data-bs-dismiss="modal">Cancel</button>
                <button type="button" id="findProducerBtn" class="btn fw-bold btn-primary m-0">Confirm</button>
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

const underWritingTemplateCustomer = `
<p class="text-center fs-7 px-3">
    Congratulations!  You have made a good progress. Your application will be sent to the insurance company by FinMind or the producer who you are working with.  Your application will be reviewed under an underwriting process.  The underwriting process consists of evaluating information and resources to determine how an individual will be classified (standard or substandard).
</p>
<h6 class="mt-5 mb-3">What's Next</h6>
<p class="fs-7">
    1.  Either the insurance company or your producer will schedule a paramedical exam to collect your medical information. You may receive email or phone call from a paramedical service provider for making an appointment. The most common service providers include:
</p>
<div class="d-flex justify-content-between px-5 mb-4">
    <img src="../img/avatar-demo.jpeg" style="width: 120px;">
    <img src="../img/avatar-demo.jpeg" style="width: 120px;">
    <img src="../img/avatar-demo.jpeg" style="width: 120px;">
</div>
<p class="fs-7">
    2.  In some cases the insurance company may have some additional documents for your signature. If required, you could use the messenger box on the right to upload your signed files. 
</p>
`;

const approvedTemplate = `
<img src="../img/passwordresetsuccessfully.png" class="d-block mx-auto" style="width: 35%;">
<p class="text-center fs-7 px-5">
    Congratulations! Your application has been approved. Please work with your producer or FinMind to finalize your application.
</p>
<p class="mt-4 fs-8 px-5 lh-lg text-body text-opacity-75">
    1. Please make the first premium payment ready.  <br />
    2. Your producer will deliver the policy to you either in hard copy or electronically. <br />
    3.  When your application case is closed, you still can review it in my application page.<br />
    4.  Please make sure your producer has uploaded the policy document and you can access it in my policy page.<br />
    5.  You may consider setting up any reminders for yourself for future milestone.<br />
    
    Thank you for your business.<br />
</p>
`;

const rejectedTemplate = `
<img src="../img/wizardsorry.png" class="d-block my-5 mx-auto" style="width: 40%;">
<p class="text-center fs-7 px-5">
    We are sorry to tell you that your application was not approved. You can work with FinMind or your producer to select different product.
</p>
`;

const needAdjustTemplate = `
<img src="../img/wizardsorry.png" class="d-block my-5 mx-auto" style="width: 40%;">
<p class="text-center fs-7 px-5">
    The insurance company wishes to earn your business, however the rates need to be adjusted. You may work with your producer or FinMind to know more details. 
</p>
`;

const underWritingTemplateProducer = `
<div class="fs-7 mt-6">
    <p>
\tAt this stage, you have collected all the information required to complete the application to the insurance policy.  Please take special care with the accuracy of the application, and then complete the final application and submit to the insurance company.
    </p>
    <p>
    \tIf any more information is required from customer, you could use the messenger tool on the right side of the page to communicate with the customer. 
    </p>
    <p>
    \tNext you may need to coordiate with the insurance company to schedule a paramedical exam for the client if the exam shall not be waived.
    </p> 
    <p class="mt-5">
        * Please keep the client updated with the latest status.
    </p>
</div>
`;

const policyTemplateProducer = `
<div class="fs-7 mt-6">
    <label class="form-label">The result of the application:</label>
    <select id="statusSelector" class="form-select form-control-lg">
        <option selected style="display:none">Please select</option>
        <option value="20">Approved</option>
        <option value="44">Rejected</option>
        <option value="30">Table rated</option>
    </select>
    <p class="mt-4 lh-lg text-body text-opacity-75" id="resultTips">
    </p>
</div>
`;

const findProducer = `
<a href="" class="fw-bold" data-bs-toggle="modal" data-bs-target="#FindProducerModal">Find a FinMind Producer</a>
`;

const producerName = `
<span>{producerName}</span>
`;

const operateBtnsCustomer = `
<a class="btn btn-outline-primary fw-bold" href="#" data-bs-toggle="modal" data-bs-target="#CancelApplication">Cancel Application</a>
<a class="btn btn-primary fw-bold ms-3" id="notifyProducerBtn" href="#" role="button">Notify Producer</a>
`;

const operateBtnsAgent = `
<a class="btn btn-primary fw-bold ms-3" id="notifyCustomerBtn" href="#" role="button">Notify Customer</a>
`;

const SIGNIN_PATH="/prelogin/login.html";

class PipelinePageHandler {
    #credMan;
    #applicationMan;
    #currentBlockIsDynamic;
    #messagingPanel;
    #filePanel;
    #appStatusMapRevert;
    #appId;

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

        let appStatusMap = MetaDataManager.appStatusMap;
        this.#appStatusMapRevert = new Map();
        for(let [key,value] of appStatusMap) {
            this.#appStatusMapRevert.set(value, key);
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
        $('#fm_div_chats_file_upload').click(e => {
            $('#chats_file_upload')[0].click();
        });

        $('#chats_file_upload').change(this.handleFileUpload.bind(this));

        $('#findProducerBtn').click(this.handleFindProducer.bind(this));

        // start testing

        // $('#fm_wz_test_button').click(this.handleTest.bind(this));
        //
        // // start validating and saving
        // $('#fm_wz_test_button2').click(this.handleTest2.bind(this));


        // const appId = 89899992;
        this.#appId = parseInt(this.getUrlParam('appId'));

        // 更新申请详情
        await this.updateApplicationInfo(this.#appId);

        $('#notifyProducerBtn').click(this.handleNotifyProducer.bind(this));
        $('#notifyCustomerBtn').click(this.handleNotifyCustomer.bind(this));

        // fill messages
        this.#messagingPanel = new MessagingPanel(100, this.#appId);

        const msgHtml = await this.#messagingPanel.getMessages();
        if (msgHtml) {
            $('#fm_div_chats').append(msgHtml);
        }

        // fill uploaded files
        this.#filePanel = new UploadedFileListPanel(this.#appId);
        await this.refreshFilePanel();
    }

    async refreshFilePanel() {

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
            let agentName = row.agent_name;
            let agentUserName = (row.agent_user_name || '').trim();
            let userName = row.user_name.trim();
            let status = row.applicatio_status;
            if (agentName!=null) {
                $('#producerNameOrFindOne').append(producerName.replace('{producerName}', agentName));
            } else {
                $('#producerNameOrFindOne').append(findProducer);
            }
            $('#customerName').text(userName);

            if (this.#credMan.credential.name===userName) {
                // client view
                if(status==='Started') {
                    const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
                    this.#applicationMan = new ApplicationPipelineManager(sessionStore, appId);
                    this.#applicationMan.initalizeState();
                } else if (status==='Underwriting') {
                    this.showUnderWriting(true);
                    $('#step1Div').css("cursor","pointer");
                    $('#step1Div').click(this.showCollectMoreInfo.bind(this));
                    $('#step2Div').css("cursor","pointer");
                    $('#step2Div').click(this.showUnderWriting.bind(this));
                } else {
                    this.showPolicyDelivery(status, true);
                    $('#step1Div').css("cursor","pointer");
                    $('#step1Div').click(this.showCollectMoreInfo.bind(this));
                    $('#step2Div').css("cursor","pointer");
                    $('#step2Div').click(this.showUnderWriting.bind(this));
                    $('#step3Div').css("cursor","pointer");
                    $('#step3Div').click(this.showPolicyDelivery.bind(this));
                }

                $('#operateDiv').append(operateBtnsCustomer);

            } else {
                // agent view
                if(status==='Started') {
                    this.showCollectMoreInfo();
                } else if (status==='Underwriting') {
                    this.showUnderWriting(false);
                    $('#step1Div').css("cursor","pointer");
                    $('#step1Div').click(this.showCollectMoreInfo.bind(this));
                    $('#step2Div').css("cursor","pointer");
                    $('#step2Div').click(() => {
                        this.showUnderWriting(false);
                    });
                } else {
                    this.showPolicyDelivery(status, false);
                    $('#step1Div').css("cursor","pointer");
                    $('#step1Div').click(this.showCollectMoreInfo.bind(this));
                    $('#step3Div').css("cursor","pointer");
                    $('#step3Div').click(() => {
                        this.showPolicyDelivery(status, false);
                    });
                }

                $('#operateDiv').append(operateBtnsAgent);

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
        let file = e.target.files[0];
        let fileName = file.name;
        let that = this;
        await FileUploadUtil.handleUploadFile(e.target, fileName, async (progress, isErr, errMsg) => {
            console.log(progress);
            if (progress==100) {
                const msgHtml = await that.#messagingPanel.sendMsg(2, fileName);
                if (msgHtml) {
                    $('#fm_div_chats').append(msgHtml);
                }
            }

        }, this.#appId);

        console.log();
        // await this.uploadFile(fileList[0]);
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
        } else {
            console.log();
        }
    }

    // Get previous blck of questions from local cache and dispolay it
    async populatePreviousQuestionBlock() {
        //const appId =  999;
        if (this.#applicationMan.canGotoPreviousBlock()) {
            const qHtml = this.#applicationMan.previousBlock();
            if (qHtml) {
                const blockInfo = await Net.getBlockInfo(this.#applicationMan.blockId);
                $('#fm_wz_block_name').text(blockInfo.blockName);
                $('#fm_wz_block_description').text(blockInfo.blockDescription);
                $('#user_question_block').html(qHtml.html);

                this.#applicationMan.hookUpEvents();
                return;
            }
        }

        // no more blocks

        alert('no more questions to answer');
        //$('#fm_wz_next_block_button').text('Start');
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
        // alert ('no more questions to answer');

        $('#fm_wz_block_description').html('No more questions to answer, please wait for the producer to process.');
        $('#user_question_block').html('');
        $('#fm_wz_block_name').text('');
    //    $('#fm_wz_next_block_button').text('Start');
    }

    async showAllBlocQuestionAnswers(appId) {
        const t = credMan.credential.token;
        const blocks = await Net.getAppPipelineBlocks(appId, t);
        // get all the answers from blocks and save then to QA Manger
        const managerList = [];
        let html = '';
        if (blocks && blocks.data.length > 0) {
            for(let i = 0; i < blocks.data.length; i++) {
                const blockId =  blocks.data[i].block_id;

                // get qestion / answer for this block
                const qaLst =  await Net.getQAForBlockOfApp(appId, blockId, t);
                const man = new ApplicationQAndAManager(appId);

                // get the static QA display (w/o interactin elements)
                const qDisplay = await man.getUserQustionDisplay(qaLst.data);
                html += qDisplay;
            }
        }
        return html;
    }

    async showCollectMoreInfo() {
        let html = await this.showAllBlocQuestionAnswers(this.#appId);
        $('#fm_wz_block_name').empty();
        $('#descriptionDiv').empty();
        $('#user_question_block').html(html);
    }

    showUnderWriting(userView) {
        this.lightUpStep2();
        $('#user_question_block').empty();
        $('#descriptionDiv').empty();
        $('#descriptionDiv').append('<h2 id="fm_wz_block_description"></h1>');
        $('#fm_wz_block_name').text("Underwriting");
        if(userView) {
            $('#fm_wz_block_description').parent().append(underWritingTemplateCustomer);
            $('#fm_wz_next_block_button').text("Back to My Applications");
            $('#fm_wz_next_block_button').off('click');
            $('#fm_wz_next_block_button').click(e => {
                window.location.href = '/mainPanel/mainPanel.html#myApplication';
            });
        } else {
            $('#fm_wz_block_description').parent().append(underWritingTemplateProducer);
            $('#fm_wz_next_block_button').text("Back to Applications");
            $('#fm_wz_next_block_button').off('click');
            $('#fm_wz_next_block_button').click(e => {
                window.location.href = '/mainPanel/mainPanel.html#applications';
            });

        }

    }

    lightUpStep2() {
        $('#step2').removeClass('text-body text-black-50');
        $('#step2').addClass('bg-primary text-white');
        $('#step2Text').removeClass('text-body text-black-50');
    }

    lightUpStep3() {
        $('#step3').removeClass('text-body text-black-50');
        $('#step3').addClass('bg-primary text-white');
        $('#step3Text').removeClass('text-body text-black-50');
    }

    showPolicyDelivery(status, userView) {
        this.lightUpStep2();
        this.lightUpStep3();
        $('#user_question_block').empty();
        $('#descriptionDiv').empty();
        $('#descriptionDiv').append('<h2 id="fm_wz_block_description"></h1>');
        $('#fm_wz_block_name').text("Policy Delivery");
        if (userView) {
            if (status==='Approved') {
                $('#fm_wz_block_description').parent().append(approvedTemplate);
            } else if (status==='Table rated') {
                $('#fm_wz_block_description').parent().append(needAdjustTemplate);
            } else if (status==='Rejected') {
                $('#fm_wz_block_description').parent().append(rejectedTemplate);
            }
            $('#fm_wz_next_block_button').text("Back to My Applications");
            $('#fm_wz_next_block_button').off('click');
            $('#fm_wz_next_block_button').click(e => {
                window.location.href = '/mainPanel/mainPanel.html#myApplication';
            });
        } else {
            $('#fm_wz_block_description').parent().append(policyTemplateProducer);
            let appStatusMap = MetaDataManager.appStatusMap;
            let statusVal = appStatusMap.get(status);
            let setContent = () => {
                let val =  $('#statusSelector').val();
                let tips = '';
                switch (val) {
                    case '20':
                        tips = '\tHere are the list of tasks when the application is approved.<br />\n' +
                            '\t1.  Notify the client that the application has been approved and send congratulations.<br />\n' +
                            '\t2.  Remind the client to set up the bank account with first premium payment ready. add sufficient funding<br />\n' +
                            '\t3.  Deliver the policy package to the client.   <br />\n' +
                            '\t4.  Go to policy page and create a policy for client.  Allow the client to view the policy document. <br />\n' +
                            '\t5.  Set up any reminders for important milestones of the policies.<br />';

                        break;
                    case '30':
                        tips = '\tHere are the list of tasks when the application is table rated.<br />\n' +
                            '\t1.   Notify the client that the application has been table rated.<br />\n' +
                            '\t2.  Explain what is table rated and why.<br />\n' +
                            '\t3.  If client chooses accept the product, finalize the application and deliver the policy to client.  Create a policy for client in policy page and allow client to view the documents.<br />\n' +
                            '\t4.  If client doesn\'t accept the table rates, work with client to searching for new product with new application. Then set this state as complete.<br />';
                        break;
                    case '44':
                        tips = '\tHere are the list of tasks when the application is rejected.<br />\n' +
                            '\t1.   Notify the client that the application has been rejected.<br />\n' +
                            '\t2.  Help client to find new product.<br />\n' +
                            '\t3.  Set this state as complete.<br />';
                        break;
                }
                $('#resultTips').html(tips);
            };
            $('#statusSelector').change(ee => {
                setContent();
            });
            $('#statusSelector').val(statusVal);
            setContent();
            // if (status==='Approved') {
            //     $('#fm_wz_block_description').parent().append(policyTemplateProducer);
            // } else if (status==='Table rated') {
            //     $('#fm_wz_block_description').parent().append(needAdjustTemplate);
            // } else if (status==='Rejected') {
            //     $('#fm_wz_block_description').parent().append(rejectedTemplate);
            // }
            $('#fm_wz_next_block_button').text("Confirm");
            $('#fm_wz_next_block_button').off('click');
            $('#fm_wz_next_block_button').click(async e => {
                let val =  $('#statusSelector').val();
                let res = await Net.updateApplicationStatus(credMan.credential.token, this.#appId, parseInt(val));
                if (res.errCode!=0) {
                    let errMsg = res.err.msg;
                    alert(errMsg);
                    return;
                } else {
                    alert('updated');
                }
                // window.location.href = '/mainPanel/mainPanel.html#myApplication';
            });
        }

    }

    async handleFindProducer() {
        let email = $('#producerEmailInput').val();
        let res = await Net.userFindAgent(credMan.credential.token, email);
        if (res.errCode!=0) {
            let errMsg = res.err.msg;
            alert(errMsg);
            return;
        }
        if (res.data.length==0) {
            alert('no such producer.');
            return;
        }
        let agentName = res.data[0].agent_name;

        res = await Net.userInviteAgent(credMan.credential.token, this.#appId, email);
        if (res.errCode!=0) {
            let errMsg = res.err.msg;
            alert(errMsg);
            return;
        }
        $('#producerNameOrFindOne a').remove();
        $('#producerNameOrFindOne').append(producerName.replace('{producerName}', agentName));
        $('#FindProducerModal').modal('hide');
        alert('Invited');
    }

    async viewStep1() {
        this.showCollectMoreInfo();

    }

    async handleNotifyProducer() {
        let res = await Net.userNotifyAgent(credMan.credential.token, this.#appId);
        if (res.errCode!=0) {
            let errMsg = res.err.msg;
            alert(errMsg);
            return;
        } else {
            alert('notified');
        }
    }

    async handleNotifyCustomer() {
        let res = await Net.agentNotifyCustomer(credMan.credential.token, this.#appId);
        if (res.errCode!=0) {
            let errMsg = res.err.msg;
            alert(errMsg);
            return;
        } else {
            alert('notified');
        }
    }

}

let pipelinePageHandler = null;

$( document ).ready(function() {
    console.log( "index page ready!" );
    $("#pageContainer").html(page_template);
    pipelinePageHandler = new PipelinePageHandler(credMan);
});
