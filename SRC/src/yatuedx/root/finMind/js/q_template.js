import {UserEnumQuestionRadio} 		from './q_enum.js'
import {UserEnumQuestionCheckbox} 	from './q_enum_checkbox.js'
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

const enumValueForSex =  ['Male', 'Female', 'Other' ];
const enumValueForMarriage =  ['Single', 'Married', 'Divorced', 'Widowed' ];
const enumExerciseFrequency =  ['Never', '1~2 times per week', '3~5 times per week', 'Everyday' ];
const enumDrinkingFrequency =  ['Never', 'Light', 'Social Occasion', 'Heavy' ];
const enumResidence =  ['Own', 'Rent' ];
const enumIncomeRange =  ['Under 20K', '20-50K', '50-100K', '100-150K', 'Above 150K'];
const enumYesNo =  ['Yes', 'No'];
const enumCoverageAmount =  ['200K', '500K', '1 mil', '10 mil'];
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
	#quesions;
	
	constructor(blockId){         
        this.#blockId = blockId; 
		this.#quesions = new Map();
    } 
	
	get blockId() {
		return this.#blockId;
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
		let qObj = null;
		
		switch(qInfo.attr_type) {
			case 1:
				qObj = new UserIntegerQuestionText(qInfo, 1, 80); 
				break;
			case 3:
			case 4:
				qObj = new UserIntegerPairQuestion(qInfo.attr_id, qInfo.question_text, qInfo.attr_type, 1, 100, 1, 100); 
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
				qObj = new UserEnumQuestionCheckbox(qInfo.attr_id, qInfo.question_text, qInfo.attr_type, enumMap.get(qInfo.attr_type)); 
				break;
			default:
				throw new Error("Invalid attr_type");
		}
		return qObj;
	}
}
	
export {ApplicationQAndAManager};
						
