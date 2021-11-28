import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';
import {HomeAndWizardHeader} 		from './../pages/header.js';
import {ApplicationQAndAManager}	from '../core/applicationQAndAManager.js'
import { MessagingPanel } 			from '../core/messagingPanel.js'
import {UploadedFileListPanel}		from '../core/fileListPanel.js';

// test data
const Test_Data = [
	[
		/* TEST CASE 1: US citizen enum-text control and income stuff */
				// citizenship
		{	
			block_id: 10, attr_id: 10, attr_name: 'app_citizen', attr_type: 25, 
			attr_label: 'Green card number', attr_question: '', sequence_id: 0,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: 'no', sv2: 'A123456789', 
			sv3: null, sv4: null, sv5: null
		},
				// income
		{	
			block_id: 10, attr_id: 14, attr_name: 'app_income', attr_type: 5, 
			attr_label: 'Earned anual income', attr_question: '', sequence_id: 1,
			iv1: 100000, iv2: null, dv1:null, dv2:null, sv1: null, sv2: null, 
			sv3: null, sv4: null, sv5: null
		},
				// ssn
		{	
			block_id: 10, attr_id: 8, attr_name: 'app_ssn', attr_type: 2, 
			attr_label: 'SSN', attr_question: '', sequence_id: 2,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: null, sv2: null, 
			sv3: null, sv4: null, sv5: null
		},
				// US Phone Number
		{	
			block_id: 10, attr_id: 6, attr_name: 'app_phone', attr_type: 2, 
			attr_label: 'Phone_number', attr_question: '', sequence_id: 3,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '425-269-5566', sv2: null, 
			sv3: null, sv4: null, sv5: null
		},
				// US State
		{	
			block_id: 10, attr_id: 22, attr_name: 'app_state_of_usa', attr_type: 26, 
			attr_label: 'State', attr_question: '', sequence_id: 4,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: null, sv2: null, 
			sv3: null, sv4: null, sv5: null
		},
	],
	[
		/* TEST CASE 2: composition control  */
		
					// name
		{	
			block_id: 11, attr_id: 11, attr_name: 'app_name', attr_type: 21, 
			attr_label: 'First name*Middle name*Last name', attr_question: '', sequence_id: 0,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
					// address
		{	
			block_id: 11, attr_id: 5, attr_name: 'app_address', attr_type: 22, 
			attr_label: 'Address*City*State*Zip code', attr_question: '', sequence_id: 1,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
					// driver lic
		{	
			block_id: 11, attr_id: 11, attr_name: 'app_driver_lic', attr_type: 24, 
			attr_label: 'Diver license number*Issue state', attr_question: '', sequence_id: 2,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
					// birth-country-state
		{	
			block_id: 11, attr_id: 9, attr_name: 'app_country_of_birth', attr_type: 30, 
			attr_label: 'Country of birth*State', attr_question: '', sequence_id: 3,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
					
	],
	[
		/* TEST CASE 3: beneficiary control  */
		
					// beneficiary
		{	
			block_id: 1045, attr_id: 1450, attr_name: 'app_beneficiary', attr_type: 50, 
			attr_label: '', attr_question: 'Beneficiary', sequence_id: 0,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
	],
	[
		/* TEST CASE 4: existing isurance control  */
		{	
			block_id: 1470, attr_id: 1470, attr_name: 'Existing Insurance', attr_type: 52, 
			attr_label: '', attr_question: 'Existing Insurance', sequence_id: 0,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
		/* TEST CASE 4: file upload control  */
		{	
			block_id: 2200, attr_id: 2200, attr_name: 'Existing Insurance', attr_type: 200, 
			attr_label: 'Upload Your Passport Image File', attr_question: 'File Attachment', sequence_id: 1,
			iv1: null, iv2: null, dv1:null, dv2:null, sv1: '', sv2: '', 
			sv3: null, sv4: null, sv5: null
		},
	]			
];

/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerTester extends HomeAndWizardHeader {
	#applicationMan;
	#currentBlockIsDynamic;
	#messagingPanel;
	#filePanel;
	
    constructor(credMan) {
		super(credMan); 
		this.#applicationMan = null;
		this.init();
	}
	
	// hook up events
	async init() {
	   
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
		
		$('#fm_wz_test_button').click(this.handleTest.bind(this));
		
		// start validating and saving
		$('#fm_wz_test_button2').click(this.handleTest2.bind(this));
		
		// start the wizard or applicaiton pipeline work flow
		// decide if I am logged in or not
		//const loggedIn = await this.credMan.hasLoggedIn();
		//await this.startAplicationPipeline(loggedIn);
		
		// login as lili
		await this.credMan.authenticate("ly8838", "BeiGuz0605!");
		
		// test columbus application
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
		const appId = 89898990;
		this.#applicationMan =  new ApplicationPipelineManager(sessionStore, appId);
		
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
	
	async handleTest(e) {
		e.preventDefault();
		const html = await this.showAllBlocQuestionAnswers();
		$('#user_question_block').html(html);
		
		/*
		const testCase = $('#test_case_select').val();
		this.qAndAManager = new ApplicationQAndAManager();
		const qHtml = await this.qAndAManager.getUserQustionHtml(Test_Data[testCase]);
		// then set the html for all the questions of the block
		$('#user_question_block').html(qHtml);
		this.hookUpEvents(this.qAndAManager);
		*/
		
	}
	
	async showAllBlocQuestionAnswers() {
		const appId = 89898990;
		const t = this.credMan.credential.token;
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
	
	handleTest2(e) {
		e.preventDefault();
		const inputElements = this.qAndAManager.currentQuestions;
		// now set the input value (or selection) if any
		inputElements.forEach(e => 
		{
			if (!e.onValidating()){
				alert('invalid for:' + e.id);
				return;
			}
			
			// print xml
			const xml = e.serverXML;
			console.log(xml);
		});
	}
	
	/**
		Dynamically generated html input controls hooking up event handler
	**/
	hookUpEvents(qAndAManager) {
		// Obtain the list for every newly appended input elements
		const inputElements = qAndAManager.currentQuestions;
		
		// now set the input value (or selection) if any
		inputElements.forEach(e => e.setDisplayValue());
		
		// now hook up all the input elements event handlers for 
		inputElements.forEach(e => e.onChangeEvent());
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
	
	/**
		Start the application wizard (or pipeline) by getting data for initial block.
	**/
	async startAplicationPipeline(loggedIn) {
		const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
		// if not logged in, start wizard pipeline
		if (!loggedIn) {
			//TODO: GET prod ID for wizard
			this.#applicationMan =  new WizardPipelineManager(sessionStore, 1001); 
		}
		else {
			// Start a new application for product 1:
			// TODO: get product id somewhere
			const productId = 1024;
			const appId = await this.startApplicationForProduct(productId); //4008; //
			if (appId && appId > 0) {
				// create 'ApplicationPipelineManager' for application pipeline management
				this.#applicationMan =  new ApplicationPipelineManager(sessionStore, appId);
				
			} else {
				alert('cannot start application');
				return;
			}
		}
		
		// immediately start the first block
		await this.populateNextQuestionBlock();

	}
	
	// When user clicks 'prev (<)', we need to 
	//   	1) go back to previousoly process block by 1
	//		2) display the ui for previous block
	//
	handlePrevQuestionBlock(e) {
		e.preventDefault();
		this.populatePreviousQuestionBlock();
	}
	
	/**
		start a mre application for product 1
	**/
	async startApplicationForProduct(pid) {
		const res = await Net.startAplication(pid, this.credMan.credential.token);
		if (res.err) {
			alert(res.err);
			retun;
		}
		return res.data[0].applicationId;
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
		   await this.#applicationMan.validateAndSaveCurrentBlock(this.credMan.credential.token);
		
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
		const qHtml = await this.#applicationMan.nextBlock(this.credMan.credential.token);
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

let questionAnswerTester = null;

$( document ).ready(function() {
    console.log( "wizard page ready!" );
	questionAnswerTester = new QuestionAnswerTester(credMan);
});