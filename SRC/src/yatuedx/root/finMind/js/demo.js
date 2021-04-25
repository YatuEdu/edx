import {sysConstants} from './sysConst.js'
import {credMan}      from './credManFinMind.js'
import {Net}          from './net.js';
import {QuestionView} from './q_template.js';


/**
	This class manages both login and sigup workflow
**/
class QuestionAnswerRecorder {
	#credMan;
	#questionMan;
	
    constructor(credMan) {
		this.#credMan = credMan;
		this.#questionMan = new QuestionView(0);
		this.init();
	}
	
	// hook up events
	async init() {
		// when 'Start' or 'next' button is clicked
		$('#next_button').click(this.handleNextQuestionBlock.bind(this));
		
		// decide if I am logged in or not
		const isLoggedIn = await credMan.hasLoggedIn();

		//if (!isLoggedIn) {
			await this.#credMan.authenticate('ly8838', 'BeiGuz0605!');
//}	
	}	
	
	//async 
	retrieveQestionBlock(t) {
	}
	
	
	async handleNextQuestionBlock(e) {
		e.preventDefault();
		const currentBlockId = this.#questionMan.blockId;
		const t = this.#credMan.credential.token;
		const resp = await Net.getBlockQuestions(currentBlockId, t);
		// fill question html
		if (resp && resp.err) {
			alert(resp.err);
			return;
		} else {
			const qHtml = this.#questionMan.getUserQustionHtml(resp.data);
			if (qHtml) {
				$('#user_question_block').html(qHtml);
				$('#next_button').text('Next');
			}
			else {
				this.#questionMan.blockId = 0;
				$('#next_button').text('Start');
			}	
		}
	}
}

let questionAnswerRecorder = null;

$( document ).ready(function() {
    console.log( "myGroup page ready!" );
	questionAnswerRecorder = new QuestionAnswerRecorder(credMan);
});