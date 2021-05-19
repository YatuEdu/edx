import {UserEnumQuestionRadio} 		from './q_enum.js'
import {UserEnumQuestionCheckbox} 	from './q_enum_checkbox.js'
import {UserIntegerQuestionText} 	from './q_integer.js'
import {UserIntegerPairQuestion}   	from './q_integer_pair.js'
import {UserDateQuestion}			from './q_date.js'
import {Net}          				from './net.js';

/**
	Container that holds dynamically generated HTML input controls
**/
const q_template_question = `
	<div class="row py-5">
		<div class='col-sm-10 col-lg-10 py-10'>
			<div id="card_div_{q_id}"  class="group-card">
				<div class="card h-100">
					<div class="card-body text-left">
						<h3 class="mb-0 font-weight-bold">{q_text}</h3>
						{choice_html}
					</div>
				</div>
			</div>
		</div>
	</div>`;

/**
	Enum strings.  TODO: generate them from finMind API
**/
const enumValueForSex =  ['Male', 'Female', 'Other' ];
const enumValueForMarriage =  ['Single', 'Married', 'Divorced', 'Widowed' ];
const enumExerciseFrequency =  ['Never', 'Rarely', 'Sometimes', 'Often' ];
const enumDrinkingFrequency =  ['Never', 'Light', 'Social Occasion', 'Heavy' ];
const enumResidence =  ['Own', 'Rent' ];
const enumIncomeRange =  ['Under 20K', '20-50K', '50-100K', '100-150K', 'Above 150K'];
const enumYesNo =  ['Yes', 'No'];
const enumCoverageAmount =  [
'$300,000',
'$400,000',
'$500,000',
'$600,000',
'$700,000',
'$800,000',
'$900,000',
'$1 million',
'$2 millions',
'$3 millions',
'$4 millions',
'$5 millions',
'$6 millions',
'$7 millions',
'$8 millions',
'$9 millions',
'$10 millions',
];
const enumCoverageType =  ['Term', 'Permanant'];
const enumTermCoverageYears = ['10 years', '15 years', '20 years', '25 years', '30 years', '35 years', '40 years'];
const enumApplicantRelationship = ['self', 'child', 'parent', 'spouse'];
const enumImminentEvent = 
			['Want to consider living benefit option', 
			 'Take or plan to take any of high-risk activities such as skydiving, scuba diving, car racing, hang gliding, ultralight flying, cave exploration, and etc.', 
			 'A member of, or plan on joining any branch of, the Armed Forces or reserve military unit.'
			];

 const enumMap = new Map([
    [ 6, enumValueForSex ],  			// enum type for sex
    [ 7, enumValueForMarriage],  		// enum type for marriage status
    [ 8, enumExerciseFrequency],   		// enum type for weekly exercise
	[ 9, enumDrinkingFrequency],   		// enum type for drinking often
	[ 10, enumResidence],  				// enum type for residence situation
	[ 12, enumIncomeRange],  			// enum type for income range
	[ 13, enumYesNo],  					// enum type for yes no question
	[ 14, enumCoverageAmount],  		// enum type for coverage amount
	[ 15, enumCoverageType],  			// enum type for coverage type
	[ 16, enumTermCoverageYears],  		// enum type for term coverage years
	[ 17, enumApplicantRelationship],  	// enum type for applicant relationship
	[ 18, enumImminentEvent],  			// enum type for emerneng events
  ]);

const enumType = [6, 7, 8];

class ApplicationQAndAManager {
	#blockId;
	#quesionList;
	
	constructor() {
		this.#blockId = 0;
		this.#quesionList = [];
    } 
	
	get blockId() {
		return this.#blockId;
	}	
	
	get currentQuestions() {
		return this.#quesionList;
	}

	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
	**/
	getUserQustionHtml(qList) {
		if (!qList || qList.length == 0 || qList[0].block_id === 0) {
			return '';
		}
		this.#blockId = qList[0].block_id;
		this.#quesionList = [];
		
		// SORT THE QUESTION BY ORDER ID
		const qListSorted = qList.sort( (q1, q2) => 
		{
			if (q1.order_id === q2.order_id) return 0;
			if (q1.order_id < q2.order_id) return -1;
			return 1;
		});
											
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlStr = '';
		for(let i = 0; i < qListSorted.length; ++i) {
			const q = this.createQuestion(qListSorted[i]);
			this.#quesionList.push(q);
			htmlStr +=  q_template_question
						.replace('{q_id}', q.id)
						.replace('{q_text}', q.question)
						.replace('{choice_html}', q.displayHtml);
		}	
		
		// return the html string to outer methods
		return htmlStr;
	}
	
	/**
		To create question class instance by json format from
		service API Calls
	**/
	createQuestion(qInfo) {
		let qObj = null;
		
		switch(qInfo.attr_type) {
			case 1:
				qObj = new UserIntegerQuestionText(qInfo, 1, 80); 
				break;
			case 3:
			case 4:
				qObj = new UserIntegerPairQuestion(qInfo, 1, 100, 1, 100); 
				break;
			case 11:
				qObj = new UserDateQuestion(qInfo); 
				break;
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
				qObj = new UserEnumQuestionRadio(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
			case 18:
				qObj = new UserEnumQuestionCheckbox(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
			default:
				throw new Error("Invalid attr_type");
		}
		return qObj;
	}
}

/**
	Manager for pipeline question down-loading, dynamic HTML generation,
	event handling, and question-answer saving.
	There are two derivation classes: 
		- ApplicationPipeLineManager
		- WizardPipeLineManager
**/
class PipeLineManager {
	_qAndAManager;
	
	constructor() {
		this._qAndAManager = new ApplicationQAndAManager();
    } 
	
	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
	**/
	composeUserQustionHtml(qList) {
		return this._qAndAManager.getUserQustionHtml(qList);
	}
	
	/**
		Dynamically generated html input controls hooking up event handler
	**/
	hookUpEvents() {
		// Obtain the list for every newly appended input elements
		const inputElements = this._qAndAManager.currentQuestions;
		
		// now set the input value (or selection) if any
		inputElements.forEach(e => e.setDisplayValue());
		
		// now hook up all the input elements event handlers for 
		inputElements.forEach(e => e.onChangeEvent());
	}
	
	/**
		Get the next block of questions from finMind and 
		dispolay it dynamically as HTML text
	**/
	async populateNextQuestionBlock(token) {	
		// get next block from finMind
		const resp = await this.v_getNextQuestionBlock(token);
				
		// fill question html
		if (resp && resp.err) {
			alert(resp.err);
			return '';
		} else {
			return this.composeUserQustionHtml(resp.data);
		}
	}
	
	/**
		Validate and then save all the answered questions to finMind service
	**/
	async validateAndSaveCurrentBlock(token) {
		const currentBlockId = this._qAndAManager.blockId;
		if (currentBlockId <= 0) {
			return true;
		}
		
		// first validate the current questions
		const currentQuestions = this._qAndAManager.currentQuestions;
		const found = currentQuestions.find(e => e.onValidating() === false);
		if (found) {
			alert(`Question '${found.question}' needs to be answered`);
			return false;
		}
		
		// now save the questions to DB
		const resp = await this.v_save(token);
		if (resp && resp.err) {
			alert(resp.err);
			return false;
		} else {
			return true;
		}
	}
	
	/**
		To save all the answered questions to finMind service.
		This method shall be overriden by the child classes.
	**/
	async v_save(t) {
		throw new Error('save: sub-class-should-overload-this');
	}
	
	/**
		Get the next block of questions from finMind and dispolay it
	**/
	async v_getNextQuestionBlock(t) {		
		throw new Error('save: sub-class-should-overload-this');
	}
	
	/**
		Serialize all questions ans answsers in one XML node.
	**/
	formQuestionsXml() {
		const questions = this._qAndAManager.currentQuestions;
		let xml = '<block>';
		questions.forEach(q => xml += q.serverXML);
		xml += '</block>';
		return xml;
	}
}

/**
	Manager for Application PipeLine
**/
class ApplicationPipeLineManager extends PipeLineManager {
	#appId;
	
	constructor(appId) {
		super();
		this.#appId = appId;
    } 
	
	/**
		Get the next block of questions from finMind and dispolay it
	**/
	async v_getNextQuestionBlock(t) {		
		return await Net.getBlockQuestions(this.#appId, t);
	}
	
	/**
		To save all the answered questions to finMind service
	**/
	async v_save(t) {
		const qXML = this.formQuestionsXml();
		return await Net.saveBlockQuestions(
							this.#appId, 
							this._qAndAManager.blockId, 
							qXML, 
							t);
	}
}

/**
	Manager for Wizard PipeLine 
**/
class WizardPipeLineManager extends PipeLineManager {
	#productId;
	
	constructor(prodId) {
		super();
		this.#productId = prodId;
		
		// deserialize from session storage
    } 
	
	/**
		Get the next block of questions from finMind
	**/
	async v_getNextQuestionBlock() {		
		throw new Error('unimplemented');
	}
	
	async v_save(t) {
		throw new Error('unimplemented');
	}
}

	
export {ApplicationPipeLineManager, WizardPipeLineManager};
						
