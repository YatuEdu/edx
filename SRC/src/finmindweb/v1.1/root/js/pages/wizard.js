import {sysConstants} 				from '../core/sysConst.js'
import {credMan}      				from '../core/credManFinMind.js'
import {Net}          				from '../core/net.js';
import {SessionStoreAccess}			from '../core/sessionStorage.js'
import {ApplicationPipelineManager} from '../core/applicationPipelineManager.js';
import {WizardPipelineManager} 		from '../core/wizardPipelineManager.js';

/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder {
	#credMan;
	#applicationMan;
	
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#applicationMan = null;
		this.init();
	}
	
	// hook up events
	async init() {
		// decide if I am logged in or not
		const loggedIn = await credMan.hasLoggedIn();

		// if not logged in, go to log in page
		if (!loggedIn) {
			window.location.href = "../sign/sign-in.html";
			return;
		}
		
		// when 'login'  is clicked
		$('#login_link').click(this.handleLogin.bind(this));
	
		// when 'Start' or 'next' button is clicked
		$('#fm_wz_next_block_button').click(this.handleNextQuestionBlock.bind(this));
		
		// when 'Back' or '<' button is clicked
		$('#fm_wz_prev_block_button').click(this.handlePrevQuestionBlock.bind(this));
		
		// test anomymous wizard
		$('#start_anom_button').click(this.handleNextWizardBlock.bind(this));
		
		// Start a new application for product 1:
		const appId = await this.startApplicationForProduct(1); // todo: get product id somewhere
		if (appId && appId > 0) {
			// create 'ApplicationPipelineManager' for application pipeline management
			const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
			this.#applicationMan =  new ApplicationPipelineManager(sessionStore, appId);
			
			// immediately start the first block
			await this.populateNextQuestionBlock();
		} else {
			alert('cannot start application');
		}
	}
	
	// login as test user 
	async handleLogin(e) {
		e.preventDefault();
		await this.#credMan.authenticate('chenlili', 'abc123456!!');
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
		const res = await Net.startAplication(pid, this.#credMan.credential.token);
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
	async handleNextWizardBlock(e) {
		e.preventDefault();
		
		await this.populateNextQuestionBlock();
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		
		// validate and save the current block of question answers
		const canMove = await this.#applicationMan.validateAndSaveCurrentBlock(this.#credMan.credential.token);
		
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
		//const appId =  999; 
	
		const qHtml = await this.#applicationMan.nextBlock(this.#credMan.credential.token);
		if (qHtml) {
			$('#user_question_block').html(qHtml);
			$('#fm_wz_next_block_button').text('Next');
			
			this.#applicationMan.hookUpEvents();
			return;
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