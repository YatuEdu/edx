import {sysConstants} from './sysConst.js'
import {credMan}      from './credManFinMind.js'
import {Net}          from './net.js';
import {ApplicationQAndAManager} from './q_template.js';


/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder {
	#credMan;
	#questionMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#questionMan = new ApplicationQAndAManager(999, 0);
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
			const qHtml = this.#questionMan.getUserQustionHtml(resp.data);
			if (qHtml) {
				$('#user_question_block').html(qHtml);
				$('#next_button').text('Next');
				
				// Obtain the list for every newly appended input elements
				const inputElements = this.#questionMan.getCurrentQuestions();
				
				// now set the input value (or selection) if any
				inputElements.forEach(e => e.setDisplayValue());
				
				// now hook up all the input elements event handlers for 
				inputElements.forEach(e => e.onChangeEvent());
			}
		}
	}
	
	// When user clicks 'next', we need to 
	//   	1) validate the selection and
	//		2) save the questions to server
	//		3) populate the next block questions or conclude
	//
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		
		// validate and save the current block of question answers
		const canMove = await this.validateAndSaveCurrentQuestionBlock();
		
		// get next block of questions
		if (canMove) {
			await this.populateNextQuestionBlock();
		}
	}
	
	async validateAndSaveCurrentQuestionBlock() {
		const currentBlockId = this.#questionMan.blockId;
		const appId = this.#questionMan.appId;
		if (currentBlockId <= 0) {
			return true;
		}
		
		// first validate the current questions
		const currentQuestions = this.#questionMan.getCurrentQuestions();
		const found = currentQuestions.find(e => e.onValidating() === false);
		if (found) {
			alert(`Question '${found.question}' needs to be answered`);
			return false;
		}
		
		// now save the questions to DB
		const resp = await this.saveAnswersToDB(appId, currentBlockId, currentQuestions);
		if (resp && resp.err) {
			alert(resp.err);
			return;
		} else {
			return true;
		}
	}
	
	// Get next blck of questions from DB and dispolay it
	async populateNextQuestionBlock() {
		//const appId =  999; // this.#questionMan.blockId;
		
		const t = this.#credMan.credential.token;
		const resp = await Net.getBlockQuestions(this.#questionMan.appId, t);
		
		// fill question html
		if (resp && resp.err) {
			alert(resp.err);
			return;
		} else {
			const qHtml = this.#questionMan.getUserQustionHtml(resp.data);
			if (qHtml) {
				$('#user_question_block').html(qHtml);
				$('#next_button').text('Next');
				
				// Obtain the list for every newly appended input elements
				const inputElements = this.#questionMan.getCurrentQuestions();
				
				// now set the input value (or selection) if any
				inputElements.forEach(e => e.setDisplayValue());
				
				// now hook up all the input elements event handlers for 
				inputElements.forEach(e => e.onChangeEvent());
			}
			else {
				alert ('no more questions to answer');
				$('#user_question_block').html('');
				$('#next_button').text('Start');
			}	
		}
	}
	
	/**
		To save all the answered questions to data base
	**/
	async saveAnswersToDB(appId, blckId, questions) {
		const qXML = this.formQuestionsXml(questions);
		return await Net.saveBlockQuestions(appId, blckId, qXML, this.#credMan.credential.token);
	}
	
	/**
		To save all questions in XML format to reduce
		service call and DB trafic.
	**/
	formQuestionsXml(questions) {
		let xml = '<block>';
		questions.forEach(q => xml += q.serverXML);
		xml += '</block>';
		return xml;
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});