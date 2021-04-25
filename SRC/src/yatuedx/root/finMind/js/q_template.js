import {UserEnumQuestionRadio} 		from './q_enum.js'
import {UserIntegerQuestionText} 	from './q_integer.js'
import {UserIntegerPairQuestion}   	from './q_integer_pair.js'

const q_template_question = `
	<div class="row py-5">
		<div class='col-sm-10 col-lg-10 py-10'>
			<div id="card_div_{q_id}"  class="group-card">
				<div class="card h-100">
					<div class="card-body text-center">
						<h3 class="mb-0 font-weight-bold">{q_text}</h3>
						<p>{choice_html}</p>
					</div>
				</div>
			</div>
		</div>
	</div>`;

const enumValueForSex =  ['male', 'female', 'other' ];
const enumValueForMarriage =  ['single', 'married', 'divorced', 'widowed' ];
const enumExerciseFrequency =  ['1 time', '2 times', 'more than 3 times', 'never' ];
const enumDrinkingFrequency =  ['light', 'social', 'heavy', 'never' ];

 const enumMap = new Map([
    [ 6, enumValueForSex ],  		// enum type for sex
    [ 7, enumValueForMarriage],  	// enum type for marriage status
    [ 8, enumExerciseFrequency],   	// enum type for weekly exercise
	[ 9, enumDrinkingFrequency]   	// enum type for drinking often
  ]);
const enumType = [6, 7, 8];

class QuestionView {
	#blockId;
	#quesions;
	
	constructor(blockId){         
        this.#blockId = blockId; 
		this.#quesions = new Map();
    } 
	
	get blockId() {
		return this.#blockId;
	}
	
	set	blockId(blockId) {
		this.#blockId = blockId;
	}
		
	
	getBlockQuestions(blck) {
		return this.#quesions.get(blck);
	}
	
	getCurrentQuestions() {
		return this.#quesions.get(this.#blockId);
	}

	getUserQustionHtml(qList) {
		if (!qList || qList.length == 0) {
			return '';
		}
		this.#blockId = qList[0].block_id;
		const newQuestionList = [];
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlStr = '';
		for(let i = 0; i < qList.length; ++i) {
			const q = this.createQuestion(qList[i]);
			newQuestionList.push(q);
			htmlStr +=  q_template_question
						.replace('{q_id}', q.id)
						.replace('{q_text}', q.question)
						.replace('{choice_html}', q.displayHtml);
		}	
		
		// cache all the questions for this block into the Map object
		this.#quesions.set(this.#blockId, newQuestionList);
		
		// return the html string to outer methods
		return htmlStr;
	}
	
	createQuestion(qInfo) {
		const qText = qInfo.question_text;
		let qObj = null;
		switch(qInfo.type) {
			case 1:
				qObj = new UserIntegerQuestionText(qInfo.id, qText, 1, 1, 80); 
				break;
			case 3:
			case 4:
				qObj = new UserIntegerPairQuestion(qInfo.id, qText, qInfo.type, 1, 100, 1, 100); 
				break;
			case 6:
			case 7:
			case 8:
			case 9:
				qObj = new UserEnumQuestionRadio(qInfo.id, qText, qInfo.type, enumMap.get(qInfo.type)); 
				break;
			default:
				throw new Error("Invalid type");
		}
		return qObj;
	}
}
	
export {QuestionView};
						
