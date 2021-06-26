import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';
import {HomeAndWizardHeader} 		from './header.js';

/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder extends HomeAndWizardHeader {
	#applicationMan;
	
	
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
		
		// start the wizard or applicaiton pipeline work flow
		// decide if I am logged in or not
		const loggedIn = await this.credMan.hasLoggedIn();
		await this.startAplicationPipeline(loggedIn);
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
			const appId = await this.startApplicationForProduct(1); 
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
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		
		// validate and save the current block of question answers
		const canMove = await this.#applicationMan.validateAndSaveCurrentBlock(this.credMan.credential.token);
		
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
				$('#fm_wz_block_name').html(blockInfo.blockName);
				$('#fm_wz_block_description').html(blockInfo.blockDescription);
				
				// then set the html for all the questions of the block
				$('#user_question_block').html(qHtml);
				$('#fm_wz_next_block_button').text('Next');
				
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

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "wizard page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});