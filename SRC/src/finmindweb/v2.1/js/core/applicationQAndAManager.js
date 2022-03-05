import {UserEnumQuestionRadio} 					from './q_enum.js'
import {UserEnumQuestionCheckbox} 				from './q_enum_checkbox.js'
import {UserIntegerQuestionText} 				from './q_integer.js'
import {UserIntegerPairQuestion}   				from './q_integer_pair.js'
import {UserDateQuestion}						from './q_date.js'
import {UserDropdownSelection}      			from './q_dropDown.js'
import {UserEnumRadioWithText} 					from './q_enum_with_text.js'
import {UserTextQuestion}						from './q_text.js'
import {UserNameQuestion}						from './q_name.js'
import {UserAdressQuestion}						from './q_address.js'
import {UserDecimalQuestionText}				from './q_decimal.js'
import {UserCompositeControlWithTwoDropdowns} 	from './q_composite_control_with_two_dropdowns.js'
import {FileUpload}								from './q_upload.js'
import {Net}          							from './net.js';
import {MetaDataManager}						from './metaDataManager.js'
import {UIComponentFactory}						from './componentFactory.js';
import {StringUtil}		  						from './util.js';

/**
	Container that holds dynamically generated HTML input controls
**/
const q_template_question_block = `
{q_html_for_block_questions}
`;

const q_template_question = `
<div class="row g-0 px-3 px-md-0">
  <div class="col-10 col-md-10">
	<label class="form-label">{q_text}</label>
  </div>
</div>
{q_html}`;

const ATTR_FOR_INCOME = 1402;
const ATTR_FOR_NETWORTH =  1403;

const replacementForQText = '{q_text}';
const replacementForQHtml = '{q_html}';
const replacementForQHtmlBlock = '{q_html_for_block_questions}';

const enumMap = MetaDataManager.enumMap;

class ApplicationQAndAManager {
	#blockId;
	#blockName;
	#blockDescription;
	#quesionList;
	#appId;
	
	constructor(appId) {
		this.#blockId = 0;
		this.#quesionList = [];
		this.#appId = appId;
    } 
	
	get blockId() {
		return this.#blockId;
	}	
	
	get currentQuestions() {
		return this.#quesionList;
	}

	get blockName() {
		return this.#blockName;
	}
	
	set blockName(bn) {
		this.#blockName = bn;
	}
	
	get blockDescription() {
		return this.#blockDescription;
	}
	
	set blockDescription(bd) {
		this.#blockDescription = bd;
	}
	
	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions ALREADY in the object (obtained from server before).
	**/
	getUserQustionHtmlInternal() {
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlForBlock = '' ;
		let htmlStrForQuestions = '';
		for(let i = 0; i < this.#quesionList.length; ++i) {
			const q = this.#quesionList[i];
			htmlStrForQuestions +=  q_template_question
						.replace(replacementForQText, q.qInfo.attr_question)
						.replace(replacementForQHtml, q.displayHtml);
		}	
		htmlForBlock = q_template_question_block
						.replace(replacementForQHtmlBlock, htmlStrForQuestions);
						
		// return the html string to outer methods
		return htmlForBlock;
	}
	
	getAnQHtmlDisplay() {
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlForBlock = '' ;
		let htmlStrForQuestions = '';
		for(let i = 0; i < this.#quesionList.length; ++i) {
			const q = this.#quesionList[i];
			htmlStrForQuestions +=  q_template_question
						.replace(replacementForQText, q.qInfo.attr_question)
						.replace(replacementForQHtml, q.displayHtmlReadOnly);
		}	
		htmlForBlock = q_template_question_block
						.replace(replacementForQHtmlBlock, htmlStrForQuestions);
						
		// return the html string to outer methods
		return htmlForBlock;
	}
	
	async setUserQuestionsFromServerData(qList) {
		// from finMind API
		if (!qList || 
			 qList.length == 0 || 
			 typeof qList[0].block_id === 'undefined' || 
			 qList[0].block_id <= 0) 
		{
			this.#blockId = 0;
			return '';
		}
		
		this.#blockId = qList[0].block_id;
		
		// SORT THE QUESTION BY ORDER ID
		const qListSorted = qList.sort( (q1, q2) => 
		{
			return q1.sequence_id - q2.sequence_id;
		});
											
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		this.#quesionList = [];
		for(let i = 0; i < qListSorted.length; ++i) {
			const q = await this.prv_createQuestion(qListSorted[i]);
			this.#quesionList.push(q);
		}	
	}
	
	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
	**/
	async getUserQustionHtml(qList) {
		await this.setUserQuestionsFromServerData(qList);
		
		// No data 
		if (this.#blockId ==0 ) {
			return null;
		}
		
		// return the html string to outer methods
		return this.getUserQustionHtmlInternal();
	}
	
	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
		This method only displays static Q/A info, not the UI for data entering.
		
	**/
	async getUserQustionDisplay(qList) {
		await this.setUserQuestionsFromServerData(qList);
		
		// No data 
		if (this.#blockId ==0 ) {
			return null;
		}
		
		// return the html string to outer methods
		return this.getAnQHtmlDisplay();
	}
	
	/**
		Obtain the XML Representation of md5 all Q an A for this ApplicationQAndAManager
		instance.  We save this xml and later to know if some answers have been changed.
		This is an optimization for finMind service so that we don't call finMind API if a block]
		of questions have not been changed.
	**/
	getBlockXml() {
		let xml = '';
		this.#quesionList.forEach (qa =>  xml += qa.serverXML);
		return xml;
	}
	
	/**
		To create question class instance by json format from
		service API Calls
	**/
	async prv_createQuestion(qInfo) {
		let qObj = null;
		
		switch(qInfo.attr_type) {
			case 1:
				qObj = this.createIntegerField(qInfo); 
				break;
				
			case 2:
				qObj = this.createTextField(qInfo); 
				break;
				
			case 3:
			case 4:
				qObj = new UserIntegerPairQuestion(qInfo, 1, 100, 1, 100); 
				break;
				
			case 5: // decimal
				qObj = new UserDecimalQuestionText(qInfo); 
				break;
				
			case 11:
				qObj = new UserDateQuestion(qInfo); 
				break;
			
			// radio types
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 15:
			case 17:
				qObj = new UserEnumQuestionRadio(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
			
			// drop down types
			case 14:
			case 16:
			case 26:
			case 27:
			case 28:
			case 29:
			case 31:
			case 32:
				qObj = new UserDropdownSelection(qInfo, enumMap.get(qInfo.attr_type));
				break;
			
			case 24:
			case 30:
				// create composition control
				qObj = this.createCompositionControl(qInfo); 
				break;
				
			case 34:
			case 19:
				qObj = new UserEnumQuestionCheckbox(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
				
			case 20:
			case 25:
				qObj = new UserEnumRadioWithText(
								qInfo, 
								enumMap.get(qInfo.attr_type), 
								MetaDataManager.enumYesValueMap.get(qInfo.attr_type),
								"Unknown");
				break;
			
			case 21:
				qObj = new UserNameQuestion(qInfo);
				break;
			
			case 22:
				qObj = new UserAdressQuestion(qInfo);
				break;
			
			case 50:
				qObj = await this.createBeneficiaryControl(this.#appId, qInfo, false);
				break;
				
			case 51:
				qObj = await this.createBeneficiaryControl(this.#appId, qInfo, true);
				break;
				
			case 52:
				qObj = await this.createExistingIsuranceControl(this.#appId, qInfo);
				break;
				
			case 200:
				qObj = await this.createFileuploadControl(qInfo, this.#appId);
				break;
				
			default:
				throw new Error("Invalid attr_type:" + qInfo.attr_type);
		}
		return qObj;
	}
	
	/*
		Create beneficiary composite control
	*/
	async createBeneficiaryControl(appId, qInfo, isContingent) {
		return await UIComponentFactory.createBeneficiaryControl(appId, qInfo, isContingent);
	}
	
	/*
		Create Existing Isurance Composite Control
	*/
	async createExistingIsuranceControl(appId, qInfo) {
		return await UIComponentFactory.createExistingIsuranceControl(appId, qInfo);
	}
	
	/*
		Create file upload control
	 */
	async createFileuploadControl(qInfo, appId) {
		return await new FileUpload(qInfo, appId);
	}
	
	/*
		Find out the text field type by question text and create different regex for
		text validation purpose;
	*/
	createTextField(qInfo) {
		return UIComponentFactory.createTextField(qInfo);
	}
	
	/*
		Create integer field by types, some have icons associated with it or $ sign prepended
		
	*/
	createIntegerField(qInfo) {
		let isUSD = false;
		switch (qInfo.attr_id) {
			case ATTR_FOR_INCOME:
			case ATTR_FOR_NETWORTH:
				isUSD = true;
				break;
			default:
				break;
		}
		return new UserIntegerQuestionText(qInfo, 0, 0, isUSD);
	}
	
	/**
		A composition control consists of two or more instances of defined 'UserQuestionBase' object
	**/
	createCompositionControl(qInfo) {
		return UIComponentFactory.createCompositionControl(qInfo);
	}
}

export {ApplicationQAndAManager};
						
