import {sysConstants} 				from './sysConst.js'
import {credMan}      				from './credManFinMind.js'
import {Net}          				from './net.js';
import {SessionStoreAccess}			from './sessionStorage.js'
import {ApplicationPipelineManager} from './applicationPipelineManager.js';
import {WizardPipelineManager} 		from './wizardPipelineManager.js';

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
		// when 'login'  is clicked
		$('#login_link').click(this.handleLogin.bind(this));
	
		// when 'Start' or 'next' button is clicked
		$('#next_button').click(this.handleNextQuestionBlock.bind(this));
		
		// test anomymous wizard
		$('#start_anom_button').click(this.handleNextWizardBlock.bind(this));
		
		// decide if I am logged in or not
		const isLoggedIn = await credMan.hasLoggedIn();

		//if (!isLoggedIn) {
		//	await this.#credMan.authenticate('chenlili', 'abc123456!');
		//}	
	}	
	
	// login as test user 
	async handleLogin(e) {
		e.preventDefault();
		await this.#credMan.authenticate('chenlili', 'abc123456!!');
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextWizardBlock(e) {
		e.preventDefault();
		
		if (this.#applicationMan == null) {
			const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
			this.#applicationMan =  new WizardPipelineManager(sessionStore, 1); //TODO: GET prod ID
		}
		
		await this.populateNextQuestionBlock();
		
		/*
		// get the anomymous response from server
		const qHtml = await this.#wizardMan.populateNextQuestionBlock("", null);
		
		// fill question html
		if (qHtml) {
			$('#user_question_block').html(qHtml);
			$('#next_button').text('Next');
			this.#applicationMan.hookUpEvents();
		}*/
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		
		if (this.#applicationMan == null) {
			const sessionStore = new SessionStoreAccess(sysConstants.FINMIND_WIZARD_STORE_KEY);
			this.#applicationMan =  new ApplicationPipelineManager(sessionStore, 999, 0); //TODO: GET APP ID
		}
		
		// validate and save the current block of question answers
		const canMove = await this.#applicationMan.validateAndSaveCurrentBlock(this.#credMan.credential.token);
		
		// get next block of questions
		if (canMove) {
			await this.populateNextQuestionBlock();
		}
	}
	
	// Get next blck of questions from DB and dispolay it
	async populateNextQuestionBlock() {
		//const appId =  999; 
		if (typeof this.#applicationMan.blockId !== 'undefined') {
			const qHtml = await this.#applicationMan.populateNextQuestionBlock(this.#credMan.credential.token);
			if (qHtml) {
				$('#user_question_block').html(qHtml);
				$('#next_button').text('Next');
				
				this.#applicationMan.hookUpEvents();
				return;
			}
		}
		
		// no more blocks
		alert ('no more questions to answer');
		$('#user_question_block').html('');
		$('#next_button').text('Start');
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});