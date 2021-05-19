import {sysConstants} from './sysConst.js'
import {credMan}      from './credManFinMind.js'
import {Net}          from './net.js';
import {ApplicationPipeLineManager, WizardPipeLineManager} from './q_template.js';


/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder {
	#credMan;
	#applicationMan;
	#wizardMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#applicationMan = null;
		this.#wizardMan = null;
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
		await this.#credMan.authenticate('chenlili', 'abc123456!');
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextWizardBlock(e) {
		// get the anomymous response from server
		
		const resp = await Net.getWizardQuestions(1, 0);
		
		// fill question html
		if (resp && resp.err) {
			alert(resp.err);
			return;
		} else {
			alert('not ready');
		}
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		
		if (this.#applicationMan == null) {
			this.#applicationMan =  new ApplicationPipeLineManager(999, 0); //TODO: GET APP ID
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
		const qHtml = await this.#applicationMan.populateNextQuestionBlock(this.#credMan.credential.token);
		if (qHtml) {
			$('#user_question_block').html(qHtml);
			$('#next_button').text('Next');
			
			this.#applicationMan.hookUpEvents();
		}
		else {
			alert ('no more questions to answer');
			$('#user_question_block').html('');
			$('#next_button').text('Start');
		}	
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});