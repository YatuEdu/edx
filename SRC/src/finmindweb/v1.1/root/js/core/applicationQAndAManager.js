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
import {UserFormatterText}						from './q_formatter_text.js'
import {UserCompositeControl}					from './q_composite_control.js'
import {UserCompositeControlWithTwoDropdowns} 	from './q_composite_control_with_two_dropdowns.js'
import {Net}          							from './net.js';
import {MetaDataManager}						from './metaDataManager.js'
import {StringUtil}		  						from './util.js';

/**
	Container that holds dynamically generated HTML input controls
**/
const q_template_question = `
	<div class="row g-0 px-3 px-md-0">
	<h3 class="mb-0 font-weight-bold">{q_text}</h3>
	{choice_html}
	</div>`;


const q_template_question = `
<div class="form-wrap _2">
  <div class="medium-text-bold left">{q_text}</div>
  <div class="div-block-21 _3">{choice_html}</div>
</div>					
`;


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
		on the questions ALREADY in the object (obtained from server before).
	**/
	getUserQustionHtmlInternal() {
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		let htmlStr = '';
		for(let i = 0; i < this.#quesionList.length; ++i) {
			const q = this.#quesionList[i];
			
			// do not show question text starting with * (reserved for slilent question)
			const question = q.attr_question ? q.attr_question : '';
			htmlStr +=  q_template_question
						.replace('{q_id}', q.attr_id)
						.replace('{q_text}', question)
						.replace('{choice_html}', q.displayHtml);
		}	
		
		// return the html string to outer methods
		return htmlStr;
	}
	
	/**
		Form question/answer UI by dynamically generate HTML block based
		on the questions obtained from server.
	**/
	getUserQustionHtml(qList) {
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
			if (q1.sequence_id === q2.sequence_id) return 0;
			if (q1.sequence_id < q2.sequence_id) return -1;
			return 1;
		});
											
		// form the question block HTML by enumerating each question
		// and make each question forms its onw html div element:
		this.#quesionList = [];
		for(let i = 0; i < qListSorted.length; ++i) {
			const q = this.prv_createQuestion(qListSorted[i]);
			this.#quesionList.push(q);
		}	
		
		// return the html string to outer methods
		return this.getUserQustionHtmlInternal();
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
	prv_createQuestion(qInfo) {
		let qObj = null;
		
		switch(qInfo.attr_type) {
			case 1:
				qObj = new UserIntegerQuestionText(qInfo, 1, 80); 
				break;
				
			case 2:
				qObj = this.createTextField_private(qInfo); 
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
				
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 12:
			case 13:
			case 15:
			case 16:
			case 17:
				qObj = new UserEnumQuestionRadio(qInfo, enumMap.get(qInfo.attr_type)); 
				break;
				
			case 14:
			case 26:
				qObj = new UserDropdownSelection(qInfo, enumMap.get(qInfo.attr_type));
				break;
			
			case 24:
			case 30:
				// create composition control
				qObj = this.createComposition_private(qInfo); 
				break;
				
			case 18:
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
					
			default:
				throw new Error("Invalid attr_type");
		}
		return qObj;
	}
	
	/*
		Find out the text field type by question text and create different regex for
		text validation purpose;
	*/
	createTextField_private(qInfo) {
		let regex = null;
		let formatter = null;
		let numberOnly = false;
		
		if (qInfo.attr_name ==='app_email') {
			// email regex
			regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		} 
		else if (qInfo.attr_name ==='app_phone') {
			// us phone number regex
			regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
			formatter = StringUtil.formatUSPhoneNumber;
			numberOnly = true;
		}
		else if (qInfo.attr_name ==='app_ssn') {
			// us ssn regex
			regex = /^\d{3}-?\d{2}-?\d{4}$/;
			formatter = StringUtil.formatSocialSecurity;
			numberOnly = true;
		}
		else {
			// reg for everything
			regex = MetaDataManager.regForEverything;
		}
		
		if (!formatter) {
			return new UserTextQuestion(qInfo, regex);
		}
		
		// formatter text input
		return new UserFormatterText(qInfo, numberOnly, regex, formatter);
	}
	
	/**
		A composition control consists of two or more instances of defined 'UserQuestionBase' object
	**/
	createComposition_private(qInfo) {
		// composite control for driver lic - state
		if (qInfo.attr_name ==='app_driver_lic') {
			const components = [];
			const labels = qInfo.attr_label.split('*');
			
			// create lic text input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex = MetaDataManager.regForEverything;
			const com1 = new UserTextQuestion(subqInfo, regex);
			components.push(com1);
			
			
			// create state drop down list:
			//		partial qinfo contains label is enough because it is a sub-control
			const STATE_ENUM_ID = 26;
			const subqInfo2 = {attr_id: qInfo.attr_id, attr_label: labels[1], sv1: qInfo.sv2};
			const com2 = new UserDropdownSelection(subqInfo2, enumMap.get(STATE_ENUM_ID), true);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControl(qInfo, components);
		} 
		
		// composite control for birth contry - state if us
		if (qInfo.attr_name ==='app_country_of_birth') {
			const components = [];
			const labels = qInfo.attr_label.split('*');
			
			// create lic text input:
			//		partial qinfo contains label is enough because it is a sub-control
			const subqInfo = {attr_id: qInfo.attr_id, attr_label: labels[0], sv1: qInfo.sv1};
			const regex = MetaDataManager.regForEverything;
			const COUNTRY_ENUM_ID = 30;
			const com1 = new UserDropdownSelection(subqInfo, enumMap.get(COUNTRY_ENUM_ID), 0);
			components.push(com1);
			
			
			// create state drop down list:
			//		partial qinfo contains label is enough because it is a sub-control
			
			const subqInfo2 = {attr_id: qInfo.attr_id, attr_label: labels[1], sv1: qInfo.sv2};
			const STATE_ENUM_ID = 26;
			const com2 = new UserDropdownSelection(subqInfo2, enumMap.get(STATE_ENUM_ID), 1);
			components.push(com2);
			
			// now create composite control
			return new UserCompositeControlWithTwoDropdowns(qInfo, components, 'United States');
		}
	}
}

export {ApplicationQAndAManager};
						
