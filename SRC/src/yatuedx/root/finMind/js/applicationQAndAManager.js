import {UserEnumQuestionRadio} 		from './q_enum.js'
import {UserEnumQuestionCheckbox} 	from './q_enum_checkbox.js'
import {UserIntegerQuestionText} 	from './q_integer.js'
import {UserIntegerPairQuestion}   	from './q_integer_pair.js'
import {UserDateQuestion}			from './q_date.js'
import {UserCompositeControl}		from './q_composite_control.js'
import {Net}          				from './net.js';
import {MetaDataManager}			from './metaDataManager.js'

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

const enumMap = MetaDataManager.enumMap;

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
		if (!qList || 
			 qList.length == 0 || 
			 typeof qList[0].block_id === 'undefined' || 
			 qList[0].block_id <= 0) 
		{
			this.#blockId = 0;
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
			const q = this.prv_createQuestion(qListSorted[i]);
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
	prv_createQuestion(qInfo) {
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

export {ApplicationQAndAManager};
						
