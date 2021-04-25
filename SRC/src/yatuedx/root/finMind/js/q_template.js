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
	#_blockId;
	
	constructor(blockId){         
        this.#_blockId = blockId; 
    } 
	
	get blockId() {
		return this.#_blockId;
	}
	
	set	blockId(blockId) {
		this.#_blockId = blockId;
	}
		
	
	static formEnumQuestionb(qid, qtype, qtext) {
	
	}

	getUserQustionHtml(qList) {
		if (!qList || qList.length == 0) {
			return '';
		}
		this.#_blockId = qList[0].block_id;
		
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlStr = '';
		for(let i = 0; i < qList.length; ++i) {
			const q = this.createQuestion(qList[i]);
			const qHtml = q.obj.displayHtml();
			htmlStr +=  q_template_question
										.replace('{q_id}', q.id)
										.replace('{q_text}', q.question)
										.replace('{choice_html}', qHtml.html);
		}	
		
		return htmlStr;
	}
	
	createQuestion(qInfo) {
		const qText = qInfo.question_text;
		let qObj = null;
		switch(qInfo.type) {
			case 1:
				qObj = new UserIntegerQuestionText(qInfo.id, "", 1, 1, 80); 
				break;
			case 3:
			case 4:
				qObj = new UserIntegerPairQuestion(qInfo.id, "", qInfo.type, 1, 100, 1, 100); 
				break;
			case 6:
			case 7:
			case 8:
			case 9:
				qObj = new UserEnumQuestionRadio(qInfo.id, "", qInfo.type, enumMap.get(qInfo.type)); 
				break;
			default:
				throw new Error("Invalid type");
		}
		return {id: qInfo.id, question: qText, obj: qObj};
		
		/*
		const q1 = new UserEnumQuestionRadio(1, qText, 6, enumMap.get(6));
		const qHtml1 = q1.displayHtml();
		let htmlStr =  q_template_question
									.replace('{q_id}', "1")
									.replace('{q_text}', qText)
									.replace('{choice_html}', qHtml1.html);
								   
		const qText2 = 'your marriage status';
		const q2 = new UserEnumQuestionRadio(2, qText2, 7, enumMap.get(7));
		const qHtml2 = q2.displayHtml();
		htmlStr  +=  q_template_question
									.replace('{q_id}', "2")
									.replace('{q_text}', qText2)
									.replace('{choice_html}', qHtml2.html);
									
		const qText3 = 'your weekly exercise habit';
		const q3 = new UserEnumQuestionRadio(3, qText2, 8, enumMap.get(8));
		const qHtml3 = q3.displayHtml();
		htmlStr  +=  q_template_question
									.replace('{q_id}', "3")
									.replace('{q_text}', qText3)
									.replace('{choice_html}', qHtml3.html);
		this.#_blockId++;
		return htmlStr;
		*/
	}
	
	getUserQustionHtml1() {
		const qText = 'your age';
		const q1 = new UserIntegerQuestionText(4, qText, 1, 1, 80);
		const qHtml1 = q1.displayHtml();
		this.#_blockId++;
		return  q_template_question
								.replace('{q_id}', "4")
								.replace('{q_text}', qText)
								.replace('{choice_html}', qHtml1.html);
								   
	}
}
	
export {QuestionView};
						
