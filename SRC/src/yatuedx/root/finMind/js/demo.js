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
		this.#questionMan = new ApplicationQAndAManager(0);
		this.init();
	}
	
	// hook up events
	async init() {
		// when 'Start' or 'next' button is clicked
		$('#next_button').click(this.handleNextQuestionBlock.bind(this));
		
		// decide if I am logged in or not
		const isLoggedIn = await credMan.hasLoggedIn();

		//if (!isLoggedIn) {
			await this.#credMan.authenticate('chenlili', 'abc123456!');
//}	
	}	
	
	//async 
	retrieveQestionBlock(t) {
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
		return await this.saveAnswersToDB(currentQuestions);
	}
	
	// Get next blck of questions from DB and dispolay it
	async populateNextQuestionBlock() {
		const appId =  999; // this.#questionMan.blockId;
		
		const t = this.#credMan.credential.token;
		const resp = await Net.getBlockQuestions(appId, t);
		
		
		/*  temp test code  XXX
		const resp = { err: '', data: 
					   [
					   {block_id: 100, attr_id: 31, attr_type: 18, order_id: 1,
						 question_text: 'Does any of the following apply to the insured?'
					   },
					   {block_id: 100, attr_id: 1, attr_type: 6, order_id: 0,
						 question_text: 'Your marriage status'
					   },
		] };
		*/
		
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
				this.#questionMan.blockId = 0;
				$('#next_button').text('Start');
			}	
		}
	}
	
	// Save all the answered questions to data base
	async saveAnswersToDB(currentQuestions) {
		return await Net.saveBlockQuestions(currentQuestions, this.#credMan.credential.token);
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});